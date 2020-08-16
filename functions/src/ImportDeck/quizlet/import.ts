import * as admin from 'firebase-admin'
import Batch from 'firestore-batch'
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
	image: Buffer | null
	name: string
	subtitle: string
	description: string
	topics: string[]
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

export const createDeck = async (uid: string, data: CreateDeckData) => {
	const doc = firestore.collection('decks').doc()
	
	await doc.set({
		topics: data.topics,
		hasImage: data.image !== null,
		name: data.name,
		subtitle: data.subtitle,
		description: data.description,
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
		originalId: data.originalId
	})
	
	return doc.id
}

export const importCards = async (deckId: string, cards: PageDataTerm[]) => {
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
		uploadAssets(assets)
	])
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

const uploadAssets = (assets: Asset[]) => {
	const chunks = chunk(assets, ASSET_CHUNK_SIZE)
	
	for (const assetChunk of chunks) {
		await Promise.all(chunk.map(async ({ destination, url, contentType, token }) => {
			try {
				const { data } = await axios.get(url, { responseType: 'arraybuffer' })
				
				await storage.file(destination).save(data, {
					public: true,
					metadata: {
						contentType,
						owner: ACCOUNT_ID,
						metadata: {
							firebaseStorageDownloadTokens: token
						}
					}
				})
				
				process.stdout.write(`${message}${++j}/${chunk.length}\r`)
			} catch (error) {
				console.error(`Error uploading asset ${++j}/${chunk.length}: ${error}`)
			}
		}))
		
		console.log()
	}
}
