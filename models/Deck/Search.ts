import { createClient } from '@elastic/app-search-javascript'

import {
	DECKS_HOST_IDENTIFIER,
	DECKS_SEARCH_KEY,
	DECKS_ENGINE_NAME
} from 'lib/constants'
import Deck, { DeckData } from '.'

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

// eslint-disable-next-line
type RawSearchResultItemData = Record<string, { raw: any }>
type RawSearchResultItemDataWrapper = { data: RawSearchResultItemData }

interface SearchFunctionOptions {
	pageNumber: number
	pageSize: number
	sortAlgorithm: DeckSortAlgorithm
	filterForTopics: string[] | null
}

type SearchFunction<Item> = (
	query: string | null,
	options: SearchFunctionOptions
) => Promise<Item[]>

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

	private static deckDataFromRawData = ({
		data
	}: RawSearchResultItemDataWrapper): DeckData => ({
		id: data.id.raw,
		slugId: data.slug_id?.raw ?? '...',
		slug: data.slug?.raw ?? '...',
		topics: data.topics?.raw ?? [],
		image: data.has_image?.raw === 'true',
		name: data.name?.raw ?? '(error)',
		subtitle: data.subtitle?.raw ?? '',
		description: data.description?.raw ?? '',
		views: data.view_count?.raw ?? 0,
		uniqueViews: data.unique_view_count?.raw ?? 0,
		ratings: data.rating_count?.raw ?? 0,
		'1StarRatings': data.one_star_rating_count?.raw ?? 0,
		'2StarRatings': data.two_star_rating_count?.raw ?? 0,
		'3StarRatings': data.three_star_rating_count?.raw ?? 0,
		'4StarRatings': data.four_star_rating_count?.raw ?? 0,
		'5StarRatings': data.five_star_rating_count?.raw ?? 0,
		averageRating: data.average_rating?.raw ?? 0,
		downloads: data.download_count?.raw ?? 0,
		cards: data.card_count?.raw ?? 0,
		unsectionedCards: data.unsectioned_card_count?.raw ?? 0,
		currentUsers: data.current_user_count?.raw ?? 0,
		allTimeUsers: data.all_time_user_count?.raw ?? 0,
		favorites: data.favorite_count?.raw ?? 0,
		creatorId: data.creator_id?.raw ?? '...',
		creatorName: data.creator_name?.raw ?? '(error)',
		created: new Date(data.created?.raw).getTime(),
		updated: new Date(data.updated?.raw).getTime()
	})

	private static deckFromRawData = (data: RawSearchResultItemDataWrapper) =>
		new Deck(Search.deckDataFromRawData(data))

	private static searchToRawData: SearchFunction<RawSearchResultItemDataWrapper> = async (
		query,
		{ pageNumber, pageSize, sortAlgorithm, filterForTopics }
	) => {
		const options: Record<string, unknown> = {
			page: { size: pageSize, current: pageNumber }
		}

		const encodedSortAlgorithm = Search.encodeSortAlgorithm(sortAlgorithm)

		if (encodedSortAlgorithm) options.sort = encodedSortAlgorithm

		if (filterForTopics?.length) options.filters = { topics: filterForTopics }

		return (await Search.client.search(query ?? '', options)).results
	}

	static searchToDeckData: SearchFunction<DeckData> = async (...options) =>
		(await Search.searchToRawData(...options)).map(Search.deckDataFromRawData)

	static search: SearchFunction<Deck> = async (...options) =>
		(await Search.searchToRawData(...options)).map(Search.deckFromRawData)

	static recommendedDecks = (pageSize: number, interests: string[]) =>
		Search.search(null, {
			pageNumber: 1,
			pageSize,
			sortAlgorithm: DeckSortAlgorithm.Recommended,
			filterForTopics: interests.length ? interests : null
		})
}
