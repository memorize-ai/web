import { createClient } from '@elastic/app-search-javascript'

import { DECKS_HOST_IDENTIFIER, DECKS_SEARCH_KEY, DECKS_ENGINE_NAME } from 'lib/constants'
import Deck from '.'

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

export const DEFAULT_DECK_SORT_ALGORITHM = DeckSortAlgorithm.Recommended

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

export const nameForDeckSortAlgorithm = (algorithm: DeckSortAlgorithm) => {
	switch (algorithm) {
		case DeckSortAlgorithm.Relevance:
			return 'Relevance'
		case DeckSortAlgorithm.Recommended:
			return 'Recommended'
		case DeckSortAlgorithm.Top:
			return 'Top'
		case DeckSortAlgorithm.Rating:
			return 'Rating'
		case DeckSortAlgorithm.CurrentUsers:
			return 'Popularity'
		case DeckSortAlgorithm.NumberOfCards:
			return 'Number of cards'
		case DeckSortAlgorithm.New:
			return 'New'
		case DeckSortAlgorithm.RecentlyUpdated:
			return 'Recently updated'
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
			slugId: data.slug_id?.raw ?? '...',
			slug: data.slug?.raw ?? '...',
			topics: data.topics?.raw ?? [],
			hasImage: data.has_image?.raw === 'true',
			name: data.name?.raw ?? '(error)',
			subtitle: data.subtitle?.raw ?? '',
			description: data.description?.raw ?? '',
			numberOfViews: data.view_count?.raw ?? 0,
			numberOfUniqueViews: data.unique_view_count?.raw ?? 0,
			numberOfRatings: data.rating_count?.raw ?? 0,
			numberOf1StarRatings: data.one_star_rating_count?.raw ?? 0,
			numberOf2StarRatings: data.two_star_rating_count?.raw ?? 0,
			numberOf3StarRatings: data.three_star_rating_count?.raw ?? 0,
			numberOf4StarRatings: data.four_star_rating_count?.raw ?? 0,
			numberOf5StarRatings: data.five_star_rating_count?.raw ?? 0,
			averageRating: data.average_rating?.raw ?? 0,
			numberOfDownloads: data.download_count?.raw ?? 0,
			numberOfCards: data.card_count?.raw ?? 0,
			numberOfUnsectionedCards: data.unsectioned_card_count?.raw ?? 0,
			numberOfCurrentUsers: data.current_user_count?.raw ?? 0,
			numberOfAllTimeUsers: data.all_time_user_count?.raw ?? 0,
			numberOfFavorites: data.favorite_count?.raw ?? 0,
			creatorId: data.creator_id?.raw ?? '...',
			creatorName: data.creator_name?.raw ?? '(error)',
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
		
		if (filterForTopics?.length)
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
