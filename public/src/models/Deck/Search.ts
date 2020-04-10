import { createClient } from '@elastic/app-search-javascript'

import { DECKS_HOST_IDENTIFIER, DECKS_SEARCH_KEY, DECKS_ENGINE_NAME } from '../../constants'
import Deck from '.'

import '../../types/app-search-javascript.d'

export enum DeckSortAlgorithm {
	Relevance = 'relevance',
	Recommended = 'recommended',
	Top = 'top',
	Rating = 'rating',
	CurrentUsers = 'popularity',
	NumberOfCards = 'card-count',
	New = 'new',
	RecentlyUpdated = 'recently-updated'
}

export const decodeDeckSortAlgorithm = (string: string) => {
	switch (string) {
		case 'relevance':
			return DeckSortAlgorithm.Relevance
		case 'recommended':
			return DeckSortAlgorithm.Recommended
		case 'top':
			return DeckSortAlgorithm.Top
		case 'rating':
			return DeckSortAlgorithm.Rating
		case 'popularity':
			return DeckSortAlgorithm.CurrentUsers
		case 'card-count':
			return DeckSortAlgorithm.NumberOfCards
		case 'new':
			return DeckSortAlgorithm.New
		case 'recently-updated':
			return DeckSortAlgorithm.RecentlyUpdated
		default:
			return null
	}
}

type RawSearchResultItemData = Record<string, { raw: any }>

export default class Search {
	private static client = createClient({
		hostIdentifier: DECKS_HOST_IDENTIFIER,
		searchKey: DECKS_SEARCH_KEY,
		engineName: DECKS_ENGINE_NAME
	})
	
	private static encodeSortAlgorithm = (
		algorithm: DeckSortAlgorithm
	): Record<string, string> | null => {
		switch (algorithm) {
			case DeckSortAlgorithm.Relevance:
				return null
			case DeckSortAlgorithm.Recommended:
			case DeckSortAlgorithm.Top:
				return { score: 'desc' }
			case DeckSortAlgorithm.Rating:
				return { average_rating: 'desc' }
			case DeckSortAlgorithm.CurrentUsers:
				return { current_user_count: 'desc' }
			case DeckSortAlgorithm.NumberOfCards:
				return { card_count: 'desc' }
			case DeckSortAlgorithm.New:
				return { created: 'desc' }
			case DeckSortAlgorithm.RecentlyUpdated:
				return { updated: 'desc' }
		}
	}
	
	private static createDeckFromRawData = (data: RawSearchResultItemData) =>
		new Deck(data.id.raw, {
			slug: data.slug?.raw,
			topics: data.topics?.raw,
			hasImage: data.has_image?.raw === 'true',
			name: data.name?.raw,
			subtitle: data.subtitle?.raw,
			description: data.description?.raw,
			numberOfViews: data.view_count?.raw,
			numberOfUniqueViews: data.unique_view_count?.raw,
			numberOfRatings: data.rating_count?.raw,
			numberOf1StarRatings: data.one_star_rating_count?.raw,
			numberOf2StarRatings: data.two_star_rating_count?.raw,
			numberOf3StarRatings: data.three_star_rating_count?.raw,
			numberOf4StarRatings: data.four_star_rating_count?.raw,
			numberOf5StarRatings: data.five_star_rating_count?.raw,
			averageRating: data.average_rating?.raw,
			numberOfDownloads: data.download_count?.raw,
			numberOfCards: data.card_count?.raw,
			numberOfUnsectionedCards: data.unsectioned_card_count?.raw,
			numberOfCurrentUsers: data.current_user_count?.raw,
			numberOfAllTimeUsers: data.all_time_user_count?.raw,
			numberOfFavorites: data.favorite_count?.raw,
			creatorId: data.creator_id?.raw,
			creatorName: data.creator_name?.raw,
			created: new Date(data.created?.raw),
			lastUpdated: new Date(data.updated?.raw)
		})
	
	static search = async (
		query: string | null,
		{ pageNumber, pageSize, sortAlgorithm, filterForTopics }: {
			pageNumber: number
			pageSize: number
			sortAlgorithm: DeckSortAlgorithm
			filterForTopics: string[] | null
		}
	) => {
		const options: Record<string, any> = {
			page: {
				size: pageSize,
				current: pageNumber
			}
		}
		
		const encodedSortAlgorithm = Search.encodeSortAlgorithm(sortAlgorithm)
		
		if (encodedSortAlgorithm)
			options.sort = encodedSortAlgorithm
		
		if (filterForTopics)
			options.filters = { topics: filterForTopics }
		
		return ((await Search.client.search(query ?? '', options)).results as { data: RawSearchResultItemData }[])
			.map(({ data }) => Search.createDeckFromRawData(data))
	}
	
	static recommendedDecks = (pageSize: number, interests: string[]) =>
		Search.search(null, {
			pageNumber: 1,
			pageSize,
			sortAlgorithm: DeckSortAlgorithm.Recommended,
			filterForTopics: interests.length ? interests : null
		})
}
