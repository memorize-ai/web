import * as admin from 'firebase-admin'
import Batch from 'firestore-batch'
import axios from 'axios'
import { AllHtmlEntities } from 'html-entities'
import { getType } from 'mime'
import { v4 as uuid } from 'uuid'
import { chunk } from 'lodash'

import { PageDataTerm } from './meta'
import { storageUrl } from '../../utils'

const { FieldValue } = admin.firestore

const firestore = admin.firestore()
const storage = admin.storage().bucket()

const entities = new AllHtmlEntities()

const MAX_SECTION_SIZE = 50
const ASSET_CHUNK_SIZE = 200

export interface CreateDeckData {
	originalId: string
	image: {
		data: Buffer
		type: string
	} | null
	name: string
	subtitle: string
	description: string
	topics: string[]
}

export interface AddDeckSectionData {
	id: string
	numberOfCards: number
}

interface CardSide {
	front: string
	back: string
	backImageUrl: string | null
	frontAudioUrl: string | null
	backAudioUrl: string | null
}

interface Asset {
	destination: string
	url: string
	contentType: string
	token: string
}

export const createDeck = async (uid: string, {
	image,
	name,
	subtitle,
	description,
	topics,
	originalId
}: CreateDeckData) => {
	const doc = firestore.collection('decks').doc()
	
	const promises: Promise<any>[] = [
		doc.set({
			topics,
			hasImage: Boolean(image),
			name,
			subtitle,
			description,
			viewCount: 0,
			uniqueViewCount: 0,
			ratingCount: 0,
			'1StarRatingCount': 0,
			'2StarRatingCount': 0,
			'3StarRatingCount': 0,
			'4StarRatingCount': 0,
			'5StarRatingCount': 0,
			averageRating: 0,
			downloadCount: 0,
			cardCount: 0,
			unsectionedCardCount: 0,
			currentUserCount: 0,
			allTimeUserCount: 0,
			favoriteCount: 0,
			creator: uid,
			created: FieldValue.serverTimestamp(),
			updated: FieldValue.serverTimestamp(),
			source: 'quizlet',
			originalId
		})
	]
	
	if (image)
		promises.push(
			storage.file(`decks/${doc.id}`).save(image.data, {
				public: true,
				contentType: image.type,
				metadata: {
					metadata: {
						firebaseStorageDownloadTokens: uuid(),
						owner: uid
					}
				}
			})
		)
	
	await Promise.all(promises)
	
	return doc.id
}

/** @returns The first section */
export const importCards = async (uid: string, deckId: string, cards: PageDataTerm[]) => {
	const sections = await createSections(deckId, cards.length)
	const assets: Asset[] = []
	
	const batch = new Batch(firestore)
	const collection = firestore.collection(`decks/${deckId}/cards`)
	
	let i = 0
	
	for (const card of cards) {
		const sectionId = sections[Math.floor(i / MAX_SECTION_SIZE)]
		
		batch.create(collection.doc(), {
			section: sectionId,
			...getCardSides({
				front: card.front,
				back: card.back,
				backImageUrl: card.backImageUrl && getAssetUrl(
					assets,
					card.backImageUrl,
					id => `deck-assets/${deckId}/${id}`
				),
				frontAudioUrl: card.frontAudioUrl && getAssetUrl(
					assets,
					card.frontAudioUrl,
					id => `deck-assets/${deckId}/${id}`
				),
				backAudioUrl: card.backAudioUrl && getAssetUrl(
					assets,
					card.backAudioUrl,
					id => `deck-assets/${deckId}/${id}`
				)
			}),
			viewCount: 0,
			reviewCount: 0,
			skipCount: 0
		})
		
		i++
	}
	
	await Promise.all([
		batch.commit(),
		uploadAssets(uid, assets)
	])
	
	return sections.length
		? {
			id: sections[0],
			numberOfCards: Math.min(cards.length, MAX_SECTION_SIZE)
		} as AddDeckSectionData
		: null
}

export const addDeck = (uid: string, deckId: string, section: AddDeckSectionData | null) => {
	const numberOfCards = section?.numberOfCards ?? 0
	
	const data: Record<string, any> = {
		added: FieldValue.serverTimestamp(),
		dueCardCount: numberOfCards,
		unsectionedDueCardCount: 0,
		unlockedCardCount: numberOfCards
	}
	
	if (section)
		data.sections = { [section.id]: numberOfCards }
	
	return firestore.doc(`users/${uid}/decks/${deckId}`).set(data)
}

const createSections = async (deckId: string, cards: number) => {
	const batch = new Batch(firestore)
	const count = Math.ceil(cards / MAX_SECTION_SIZE)
	
	const sections = new Array<string>(count)
	const collection = firestore.collection(`decks/${deckId}/sections`)
	
	for (let i = 0; i < count; i++) {
		const doc = collection.doc()
		sections[i] = doc.id
		
		batch.create(doc, {
			name: `Section ${i + 1}`,
			index: i,
			cardCount: 0
		})
	}
	
	await batch.commit()
	
	return sections
}

const getCardSides = ({
	front,
	back,
	backImageUrl,
	frontAudioUrl,
	backAudioUrl
}: CardSide) => {
	front = `<h3 style="text-align:center;">${richTextToHtml(front)}</h3>`
	back = `<h3 style="text-align:center;">${richTextToHtml(back)}</h3>`
	
	backImageUrl = backImageUrl ? `<figure class="image"><img src="${backImageUrl}"></figure>` : ''
	frontAudioUrl = frontAudioUrl ? `<audio src="${frontAudioUrl}"></audio>` : ''
	backAudioUrl = backAudioUrl ? `<audio src="${backAudioUrl}"></audio>` : ''
	
	return {
		front: `${frontAudioUrl}${front}`,
		back: `${backAudioUrl}${backImageUrl}${back}`
	}
}

const richTextToHtml = (text: string) =>
	entities.encode(text)
		.replace(/\\n/g, '<br>')
		.replace(/\*(.+?)\*/g, '<strong>$1</strong>')

const getAssetUrl = (
	assets: Asset[],
	url: string,
	_destination: string | ((id: string) => string)
) => {
	if (url.startsWith('/tts/'))
		return null // Don't include text-to-speech
	
	url = normalizeUrl(url)
	
	const contentType = getContentType(url)
	
	if (!contentType)
		return null
	
	const token = uuid()
	const destination = typeof _destination === 'string'
		? _destination
		: _destination(uuid())
	
	assets.push({
		destination,
		url,
		contentType,
		token
	})
	
	return storageUrl(destination.split('/'), token)
}

const normalizeUrl = (url: string) =>
	url.startsWith('/')
		? `https://quizlet.com${url}`
		: url

const getContentType = (url: string) =>
	getType(url.split('?')[0])

const uploadAssets = async (uid: string, assets: Asset[]) => {
	const chunks = chunk(assets, ASSET_CHUNK_SIZE)
	
	for (const assetChunk of chunks)
		await Promise.all(assetChunk.map(async ({ destination, url, contentType, token }) => {
			try {
				const { data } = await axios.get(url, { responseType: 'arraybuffer' })
				
				await storage.file(destination).save(data, {
					public: true,
					contentType,
					metadata: {
						metadata: {
							firebaseStorageDownloadTokens: token,
							owner: uid
						}
					}
				})
			} catch (error) {
				console.error(error)
			}
		}))
}
