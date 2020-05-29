import React, { useState, useContext, useMemo } from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import { DEFAULT_DECK_SORT_ALGORITHM } from '../../../models/Deck/Search'
import Counters, { Counter } from '../../../models/Counters'
import LoadingState from '../../../models/LoadingState'
import DeckImageUrlsContext from '../../../context/DeckImageUrls'
import useSearchState from '../../../hooks/useSearchState'
import useDeck from '../../../hooks/useDeck'
import useSections from '../../../hooks/useSections'
import useAllCards from '../../../hooks/useAllCards'
import useTopics from '../../../hooks/useTopics'
import useCreator from '../../../hooks/useCreator'
import useSimilarDecks from '../../../hooks/useSimilarDecks'
import Head from '../../shared/Head'
import Input from '../../shared/Input'
import SortDropdown from '../../shared/SortDropdown'
import { DropdownShadow } from '../../shared/Dropdown'
import Header from './Header'
import Preview from './Preview'
import Footer from './Footer'
import Controls from './Controls'
import SimilarDecks, { SIMILAR_DECKS_CHUNK_SIZE } from './SimilarDecks'
import Cards from './Cards'
import Comments from './Comments'
import Loader from '../../shared/Loader'
import { urlWithQuery, formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/DeckPage.scss'

export default () => {
	const [imageUrls] = useContext(DeckImageUrlsContext)
	
	const history = useHistory()
	const { slugId } = useParams()
	const [{ query, sortAlgorithm }] = useSearchState()
	
	const { deck, hasDeck } = useDeck(slugId)
	
	const imageUrlObject = (deck && imageUrls[deck.id]) ?? null
	
	const hasImageUrlLoaded = imageUrlObject?.loadingState === LoadingState.Success
	const imageUrl = imageUrlObject?.url ?? Deck.DEFAULT_IMAGE_URL
	
	const creator = useCreator(deck?.creatorId)
	const sections = useSections(deck?.id)
	const cards = useAllCards(deck?.id)
	const topics = useTopics()
	const similarDecks = useSimilarDecks(deck, SIMILAR_DECKS_CHUNK_SIZE)
	
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)
	
	const numberOfDecks = Counters.get(Counter.Decks)
	
	const description = useMemo(() => (
		deck?.description || `${
			deck?.averageRating
				? `${
					deck.averageRating.toFixed(1)
				} star${
					deck.averageRating === 1 ? '' : 's'
				} - `
				: ''
		}${
			formatNumber(deck?.numberOfCards ?? 0)
		} card${
			deck?.numberOfCards === 1 ? '' : 's'
		} - ${
			formatNumber(deck?.numberOfDownloads ?? 0)
		} download${
			deck?.numberOfDownloads === 1 ? '' : 's'
		}. Get ${
			deck?.name ?? 'this deck'
		} on memorize.ai${
			creator ? ` by ${creator.name}` : ''
		}.`
	), [deck, creator])
	
	return (
		<>
			<Head
				isPrerenderReady={Boolean(
					deck && hasImageUrlLoaded && creator && sections && cards && topics && similarDecks
				)}
				title={`${deck ? `${deck.name} | ` : ''}memorize.ai`}
				description={description}
				ogImage={imageUrl}
				labels={[
					{
						name: 'Rating',
						value: deck?.numberOfRatings
							? deck.averageRating.toFixed(1)
							: 'No ratings'
					},
					{
						name: 'Downloads',
						value: formatNumber(deck?.numberOfDownloads ?? 0)
					},
					{
						name: 'Cards',
						value: formatNumber(deck?.numberOfCards ?? 0)
					}
				]}
				breadcrumbs={[
					[
						{
							name: 'Market',
							url: 'https://memorize.ai/market'
						},
						{
							name: deck?.name ?? 'Deck',
							url: window.location.href
						}
					]
				]}
				schemaItems={[
					{
						'@type': 'IndividualProduct',
						productID: deck?.slugId ?? '...',
						image: imageUrl,
						name: deck?.name ?? 'Deck',
						description: deck?.description ?? '',
						url: window.location.href,
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: deck?.averageRating ?? 0,
							reviewCount: deck?.numberOfRatings || 1,
							worstRating: deck?.worstRating ?? 0,
							bestRating: deck?.bestRating ?? 0
						}
					}
				]}
			/>
			<div className="header">
				<Link
					className="create"
					to="/new"
					aria-label="Create your own deck!"
					data-balloon-pos="right"
				>
					<FontAwesomeIcon icon={faPlus} />
				</Link>
				<Input
					className="search"
					icon={faSearch}
					type="name"
					placeholder={
						`Explore ${numberOfDecks === null ? '...' : formatNumber(numberOfDecks)} decks`
					}
					value={query}
					setValue={newQuery =>
						history.push(urlWithQuery('/market', {
							q: newQuery,
							s: sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
								? null
								: sortAlgorithm
						}))
					}
				/>
				<SortDropdown
					shadow={DropdownShadow.Around}
					isShowing={isSortDropdownShowing}
					setIsShowing={setIsSortDropdownShowing}
					algorithm={sortAlgorithm}
					setAlgorithm={newSortAlgorithm =>
						history.push(urlWithQuery('/market', {
							q: query,
							s: newSortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
								? null
								: newSortAlgorithm
						}))
					}
				/>
			</div>
			<div className={cx('box', { loading: !deck })}>
				{deck
					? (
						<>
							<Header deck={deck} hasDeck={hasDeck} />
							{deck.numberOfCards > 0 && <Preview deck={deck} />}
							<Footer deck={deck} />
							<Controls deck={deck} hasDeck={hasDeck} />
							<SimilarDecks deck={deck} />
							<Cards deck={deck} />
							<Comments deck={deck} />
						</>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
				}
			</div>
		</>
	)
}
