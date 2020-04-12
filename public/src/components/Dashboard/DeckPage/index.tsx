import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import Schema, { IndividualProduct } from 'schema.org-react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Deck from '../../../models/Deck'
import { DEFAULT_DECK_SORT_ALGORITHM } from '../../../models/Deck/Search'
import Counters, { Counter } from '../../../models/Counters'
import useSearchState from '../../../hooks/useSearchState'
import useDeck from '../../../hooks/useDeck'
import Input from '../../shared/Input'
import SortDropdown from '../../shared/SortDropdown'
import { DropdownShadow } from '../../shared/Dropdown'
import Header from './Header'
import Preview from './Preview'
import Footer from './Footer'
import Controls from './Controls'
import Sections from './Sections'
import SimilarDecks from './SimilarDecks'
import Cards from './Cards'
import Loader from '../../shared/Loader'
import { urlWithQuery, formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/DeckPage.scss'

export const urlForDeckPage = (deck: Deck, action: 'get' | null = null) =>
	urlWithQuery(`/d/${deck.slug}`, { action })

export default () => {
	const history = useHistory()
	const { slug } = useParams()
	const [{ query, sortAlgorithm }] = useSearchState()
	
	const { deck, hasDeck } = useDeck(slug)
	
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)
	
	const numberOfDecks = Counters.get(Counter.Decks)
	
	return (
		<Dashboard selection={Selection.Market} className="deck-page" gradientHeight="500px">
			<Helmet>
				<title>{deck ? `${deck.name} | ` : ''}memorize.ai</title>
			</Helmet>
			<Schema<IndividualProduct> item={{
				'@context': 'https://schema.org',
				'@type': 'IndividualProduct',
				productID: deck?.slug,
				name: deck?.name,
				description: deck?.description,
				url: `https://memorize.ai/d/${deck?.slug ?? ''}`,
				aggregateRating: {
					'@type': 'AggregateRating'
				}
			}} />
			<div className="header">
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
							<div className="divider" />
							{deck.numberOfCards > 0 && <Preview deck={deck} />}
							<Footer deck={deck} />
							<div className="divider" />
							<Controls deck={deck} hasDeck={hasDeck} />
							<div className="divider sections-divider" />
							<Sections deck={deck} />
							<div className="divider similar-decks-divider" />
							<SimilarDecks deck={deck} />
							<div className="divider cards-divider" />
							<Cards deck={deck} />
						</>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
				}
			</div>
		</Dashboard>
	)
}
