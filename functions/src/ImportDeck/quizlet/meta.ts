import * as admin from 'firebase-admin'
import * as get from 'user-request'

import Deck from '../../Deck'
import User from '../../User'

interface RawPageDataTerm {
	id: number
	word: string
	definition: string
	_imageUrl: string | null
	_wordAudioUrl: string | null
	_definitionAudioUrl: string | null
}

interface RawPageData {
	set: {
		id: number
		title: string
		_thumbnailUrl: string | null
	}
	originalOrder: number[]
	termIdToTermsMap: Record<string, RawPageDataTerm>
}

export interface PageDataTerm {
	id: string
	front: string
	back: string
	backImageUrl: string | null
	frontAudioUrl: string | null
	backAudioUrl: string | null
}

const RAW_URL_REGEX = /^(?:https?:\/\/)?quizlet\.com\/(\d+?)\/([^\/]+?)\/?$/i
const PAGE_DATA_REGEX = /<script\sid=".+?">\(function\(\)\{window\.Quizlet\["setPageData"\]\s=\s(\{.+?\});\sQLoad\("Quizlet.setPageData"\);\}\)\.call\(this\);/i

const firestore = admin.firestore()

const normalizeUrl = (url: string) => {
	const [, id, slug] = url.match(RAW_URL_REGEX) ?? []
	
	return id && slug
		? `https://quizlet.com/${id}/${slug}/`
		: null
}

export const getPage = async (rawUrl: string) => {
	const url = normalizeUrl(rawUrl)
	
	return url
		? { url, response: await get(url) }
		: null
}

export const getPageData = (html: string) => {
	const rawData = html.match(PAGE_DATA_REGEX)?.[1]
	
	try {
		const data = rawData
			? JSON.parse(rawData) as RawPageData
			: null
		
		return data && {
			id: data.set.id.toString(),
			imageUrl: data.set._thumbnailUrl,
			name: data.set.title,
			cards: data.originalOrder.map(id => {
				const term = data.termIdToTermsMap[id]
				
				return {
					id: term.id.toString(),
					front: term.word,
					back: term.definition,
					backImageUrl: term._imageUrl,
					frontAudioUrl: term._wordAudioUrl,
					backAudioUrl: term._definitionAudioUrl
				} as PageDataTerm
			})
		}
	} catch {
		return null
	}
}

export const isExistingDeckFromOriginalId = async (id: string) => {
	try {
		const { docs } = await firestore
			.collection('decks')
			.where('source', '==', 'quizlet')
			.where('originalId', '==', id)
			.limit(1)
			.get()
		
		const snapshot = docs[0]
		
		if (!snapshot)
			return null
		
		const deck = new Deck(snapshot)
		const user = await User.fromId(deck.creatorId)
		
		return {
			user: {
				id: user.id,
				name: user.name
			},
			url: deck.url
		}
	} catch {
		return null
	}
}

export const isExistingDeckFromId = async (id: string) => {
	try {
		const deck = await Deck.fromId(id)
		const user = await User.fromId(deck.creatorId)
		
		return {
			user: {
				id: user.id,
				name: user.name
			},
			url: deck.url
		}
	} catch {
		return null
	}
}
