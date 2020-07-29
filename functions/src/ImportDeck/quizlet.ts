import * as get from 'user-request'

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

const RAW_URL_REGEX = /^(?:https?:\/\/)?quizlet\.com\/(\d+?)\/([^\/]+?)\/?$/i
const PAGE_DATA_REGEX = /<script\sid=".+?">\(function\(\)\{window\.Quizlet\["setPageData"\]\s=\s(\{.+?\});\sQLoad\("Quizlet.setPageData"\);\}\)\.call\(this\);/i

const normalizeUrl = (url: string) => {
	const [, id, slug] = url.match(RAW_URL_REGEX) ?? []
	
	return id && slug
		? `https://quizlet.com/${id}/${slug}/`
		: null
}

const getPage = async (_url: string) => {
	const url = normalizeUrl(_url)
	
	return url
		? { url, response: await get(url) }
		: null
}

const getPageData = (html: string) => {
	const rawData = html.match(PAGE_DATA_REGEX)?.[1]
	
	try {
		const data: RawPageData = JSON.parse(rawData)
		
		return {
			id: data.set.id.toString(),
			name: data.set.title,
			cards: data.originalOrder.map(id => {
				const term = data.termIdToTermsMap[id]
				
				return {
					id: term.id.toString(),
					front: term.word,
					back: term.definition,
					frontImageUrl: term._imageUrl,
					frontAudioUrl: term._wordAudioUrl,
					backAudioUrl: term._definitionAudioUrl
				}
			})
		}
	} catch {
		return null
	}
}
