import { useRef, useState, useEffect, useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import InfiniteScroll from 'react-infinite-scroller'

import { MarketQuery, MarketProps } from './models'
import Deck from 'models/Deck'
import DeckSearch, {
	DEFAULT_DECK_SORT_ALGORITHM,
	decodeDeckSortAlgorithm,
	nameForDeckSortAlgorithm,
	DeckSortAlgorithm
} from 'models/Deck/Search'
import Counters, { Counter } from 'models/Counters'
import LoadingState from 'models/LoadingState'
import searchState from 'state/search'
import { formatNumber, flattenQuery } from 'lib/utils'
import useCurrentUser from 'hooks/useCurrentUser'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import Input from 'components/Input'
import SortDropdown from 'components/SortDropdown'
import { DropdownShadow } from 'components/Dropdown'
import DeckRow from './DeckRow'
import Loader from 'components/Loader'

import styles from './index.module.scss'

const Market: NextPage<MarketProps> = ({ decks: initialNumberOfDecks }) => {
	const isLoading = useRef(true)
	const scrollingContainerRef = useRef(null as HTMLDivElement | null)

	const router = useRouter()

	const [currentUser, currentUserLoadingState] = useCurrentUser()
	const setSearchState = useSetRecoilState(searchState)

	const query = (router.query as MarketQuery).q ?? ''
	const sortAlgorithm =
		decodeDeckSortAlgorithm((router.query as MarketQuery).s ?? '') ??
		DEFAULT_DECK_SORT_ALGORITHM

	const [decks, setDecks] = useState([] as Deck[])
	const [isLastPage, setIsLastPage] = useState(false)
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)

	const numberOfDecks = Counters.get(Counter.Decks) ?? initialNumberOfDecks

	const shouldHideSortAlgorithm =
		sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM ||
		sortAlgorithm === DeckSortAlgorithm.Relevance

	const topics = currentUser && currentUser.interestIds

	const getDecks = useCallback(
		async (pageNumber: number) => {
			try {
				const decks = await DeckSearch.search(query, {
					pageNumber,
					pageSize: 40,
					sortAlgorithm,
					filterForTopics:
						sortAlgorithm === DeckSortAlgorithm.Recommended ? topics : null
				})

				if (!decks.length) setIsLastPage(true)

				return decks
			} catch (error) {
				setIsLastPage(true)
				console.error(error)

				return []
			}
		},
		[query, sortAlgorithm, topics, setIsLastPage]
	)

	const loadMoreDecks = useCallback(
		async (pageNumber: number) => {
			if (isLoading.current) return

			isLoading.current = true

			setDecks([...decks, ...(await getDecks(pageNumber))])

			isLoading.current = false
		},
		[setDecks, decks, getDecks]
	)

	useEffect(() => {
		if (
			currentUserLoadingState !== LoadingState.Success ||
			(currentUser && !topics)
		)
			return

		isLoading.current = true

		setIsLastPage(false)

		let shouldContinue = true

		getDecks(1).then(decks => {
			if (!shouldContinue) return

			setDecks(decks)
			isLoading.current = false

			const container = scrollingContainerRef.current

			if (container) container.scrollTop = 0
		})

		setSearchState({ query, sortAlgorithm })

		return () => {
			shouldContinue = false
			isLoading.current = false
		}
	}, [
		currentUserLoadingState,
		currentUser,
		topics,
		query,
		sortAlgorithm,
		getDecks,
		setSearchState
	])

	const onInputRef = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])

	const setQuery = useCallback(
		(newQuery: string) => {
			router.replace(
				{
					pathname: '/market',
					query: flattenQuery({
						q: newQuery,
						s: newQuery
							? sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
								? DeckSortAlgorithm.Relevance
								: sortAlgorithm
							: sortAlgorithm === DeckSortAlgorithm.Relevance
							? null
							: sortAlgorithm
					})
				},
				undefined,
				{ shallow: true }
			)
		},
		[router, sortAlgorithm]
	)

	const setSortAlgorithm = useCallback(
		(newAlgorithm: DeckSortAlgorithm) => {
			router.replace(
				{
					pathname: '/market',
					query: flattenQuery({
						q: query,
						s:
							newAlgorithm === DEFAULT_DECK_SORT_ALGORITHM ? null : newAlgorithm
					})
				},
				undefined,
				{ shallow: true }
			)
		},
		[router, query]
	)

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={Selection.Market}
		>
			<Head
				title={`${query && `${query} | `}${
					shouldHideSortAlgorithm
						? ''
						: `${nameForDeckSortAlgorithm(sortAlgorithm)} | `
				}memorize.ai Marketplace`}
				description="Search the Marketplace on memorize.ai. Unlock your true potential by using Artificial Intelligence to help you learn."
				breadcrumbs={url => [[{ name: 'Market', url }]]}
			/>
			<div className={styles.header}>
				<Link href="/new">
					<a
						className={styles.new}
						aria-label="Create your own deck!"
						data-balloon-pos="right"
					>
						<FontAwesomeIcon className={styles.newIcon} icon={faPlus} />
					</a>
				</Link>
				<Input
					ref={onInputRef}
					className={styles.search}
					inputClassName={styles.searchInput}
					iconClassName={styles.searchIcon}
					icon={faSearch}
					type="name"
					name="search_term_string"
					placeholder={`Explore ${
						numberOfDecks === null ? '...' : formatNumber(numberOfDecks)
					} decks`}
					value={query}
					setValue={setQuery}
				/>
				<SortDropdown
					shadow={DropdownShadow.Screen}
					isShowing={isSortDropdownShowing}
					setIsShowing={setIsSortDropdownShowing}
					algorithm={sortAlgorithm}
					setAlgorithm={setSortAlgorithm}
				/>
			</div>
			<div ref={scrollingContainerRef} className={styles.decks}>
				<InfiniteScroll
					className={styles.decksContent}
					loadMore={loadMoreDecks}
					hasMore={!isLastPage}
					loader={
						<Loader
							key={0}
							className={styles.loader}
							size="24px"
							thickness="4px"
							color={decks.length ? '#582efe' : 'white'}
						/>
					}
					useWindow={false}
				>
					{decks.map(deck => (
						<DeckRow key={deck.id} deck={deck} />
					))}
				</InfiniteScroll>
			</div>
		</Dashboard>
	)
}

export default Market
