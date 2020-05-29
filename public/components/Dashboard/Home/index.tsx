import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useRecommendedDecks from 'hooks/useRecommendedDecks'
import Head, { APP_DESCRIPTION, APP_SCHEMA } from 'components/shared/Head'
import OwnedDeckCell from 'components/shared/DeckCell/Owned'
import DeckCell from 'components/shared/DeckCell'
import DownloadAppModal from 'components/shared/Modal/DownloadApp'
import { formatNumber } from 'lib/utils'

import styles from 'styles/components/Dashboard/Home.module.scss'

export default () => {
	const router = useRouter()
	const [currentUser] = useCurrentUser()
	
	const [decks] = useDecks()
	const recommendedDecks = useRecommendedDecks(20)
	
	const [isDownloadAppModalShowing, setIsDownloadAppModalShowing] = useState(false)
	const [downloadAppMessage, setDownloadAppMessage] = useState('')
	
	const dueCards = decks.reduce((acc, deck) => (
		acc + (deck.userData?.numberOfDueCards ?? 0)
	), 0)
	
	const decksByCardsDue = decks.sort((a, b) =>
		(b.userData?.numberOfDueCards ?? 0) - (a.userData?.numberOfDueCards ?? 0)
	)
	
	const downloadApp = useCallback((deck: Deck) => {
		const numberOfDueCards = deck.userData?.numberOfDueCards
		
		if (!numberOfDueCards)
			return
		
		setDownloadAppMessage(
			`Download memorize.ai on the App Store to review ${
				formatNumber(numberOfDueCards)
			} card${numberOfDueCards === 1 ? '' : 's'}!`
		)
		
		setIsDownloadAppModalShowing(true)
	}, [])
	
	return (
		<Dashboard selection={Selection.Home} className="home">
			<Head
				title="memorize.ai"
				description={APP_DESCRIPTION}
				breadcrumbs={[
					[
						{
							name: 'Dashboard',
							url: `https://memorize.ai${router.asPath}`
						}
					]
				]}
				schemaItems={[
					APP_SCHEMA
				]}
			/>
			<div className="header">
				<div className="left">
					<h1 className="title">
						Hello, {currentUser?.name}
					</h1>
					<h3 className="subtitle">
						You have {dueCards ? formatNumber(dueCards) : 'no'} card{dueCards === 1 ? '' : 's'} due
					</h3>
					{dueCards > 0 && (
						<button
							className="review"
							onClick={() => {
								setDownloadAppMessage(
									`Download memorize.ai on the App Store to review ${formatNumber(dueCards)} card${dueCards === 1 ? '' : 's'}!`
								)
								setIsDownloadAppModalShowing(true)
							}}
						>
							Review all
						</button>
					)}
				</div>
				<Link href="/new">
					<a className="create-deck-link">
						<FontAwesomeIcon icon={faPlus} />
						<p>Create deck</p>
					</a>
				</Link>
			</div>
			{decks.length === 0 || (
				<div className="my-decks">
					<h1>My decks</h1>
					<div className="decks">
						<div>
							{decksByCardsDue
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<OwnedDeckCell
										key={deck.id}
										deck={deck}
										downloadApp={() => downloadApp(deck)}
									/>
								))
							}
						</div>
						<div>
							{decksByCardsDue
								.filter((_, i) => i & 1)
								.map(deck => (
									<OwnedDeckCell
										key={deck.id}
										deck={deck}
										downloadApp={() => downloadApp(deck)}
									/>
								))
							}
						</div>
					</div>
				</div>
			)}
			{recommendedDecks.length === 0 || (
				<div className="recommended-decks">
					<h1 style={{ color: decks.length ? 'black' : 'white' }}>
						Recommended decks
					</h1>
					<div className="decks">
						<div>
							{recommendedDecks
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<DeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
						<div>
							{recommendedDecks
								.filter((_, i) => i & 1)
								.map(deck => (
									<DeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
					</div>
				</div>
			)}
			<DownloadAppModal
				message={downloadAppMessage}
				isShowing={isDownloadAppModalShowing}
				setIsShowing={setIsDownloadAppModalShowing}
			/>
		</Dashboard>
	)
}
