import React from 'react'
import Helmet from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import Schema, { IndividualProduct } from 'schema.org-react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Dashboard, { DashboardNavbarSelection as Selection, selectionFromUrl } from '..'
import Deck from '../../../models/Deck'
import Counters, { Counter } from '../../../models/Counters'
import useQuery from '../../../hooks/useQuery'
import useDeck from '../../../hooks/useDeck'
import BackButton from '../../shared/BackButton'
import Input from '../../shared/Input'
import Header from './Header'
import Footer from './Footer'
import Controls from './Controls'
import Sections from './Sections'
import SimilarDecks from './SimilarDecks'
import Loader from '../../shared/Loader'
import { urlWithQuery, formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/DeckPage.scss'

export const urlForDeckPage = (
	deck: Deck,
	{ query = '', action = null }: { query?: string, action?: 'get' | null } = {}
) => {
	const { pathname, search } = window.location
	
	return urlWithQuery(`/d/${deck.slug}`, {
		q: query,
		prev: `${pathname}${search}`,
		action
	})
}

export default () => {
	const history = useHistory()
	const { slug } = useParams()
	const searchParams = useQuery()
	
	const { deck, hasDeck } = useDeck(slug)
	
	const query = searchParams.get('q') ?? ''
	const previousUrl = searchParams.get('prev')
	
	const numberOfDecks = Counters.get(Counter.Decks)
	const selection = (previousUrl && selectionFromUrl(previousUrl)) || Selection.Market
	
	return (
		<Dashboard selection={selection} className="deck-page" gradientHeight="500px">
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
				<BackButton to={previousUrl || '/market'} />
				<Input
					className="search"
					icon={faSearch}
					type="name"
					placeholder={
						`Explore ${numberOfDecks === null ? '...' : formatNumber(numberOfDecks)} decks`
					}
					value={query}
					setValue={newQuery =>
						history.push(urlWithQuery('/market', { q: newQuery }))
					}
				/>
			</div>
			<div className={cx('box', { loading: !deck })}>
				{deck
					? (
						<>
							<Header deck={deck} hasDeck={hasDeck} />
							<Footer deck={deck} />
							<div className="divider" />
							<Controls deck={deck} hasDeck={hasDeck} />
							<div className="divider sections-divider" />
							<Sections deck={deck} />
							<div className="divider" />
							<SimilarDecks deck={deck} />
						</>
					)
					: <Loader size="24px" thickness="4px" color="#582efe" />
				}
			</div>
		</Dashboard>
	)
}
