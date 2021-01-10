import { useMemo } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useRecommendedDecks from 'hooks/useRecommendedDecks'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import Activity from 'components/Activity'
import OwnedDeckCell from 'components/DeckCell/Owned'
import DeckCell from 'components/DeckCell'
import { formatNumber } from 'lib/utils'

export interface DashboardHomeProps {
	expectsSignIn?: boolean | null
}

const DashboardHome = ({ expectsSignIn = null }: DashboardHomeProps) => {
	const [currentUser] = useCurrentUser()

	const [decks] = useDecks()
	const recommendedDecks = useRecommendedDecks(20)

	const dueCards = useMemo(
		() =>
			decks.reduce(
				(acc, deck) => acc + (deck.userData?.numberOfDueCards ?? 0),
				0
			),
		[decks]
	)

	const decksByCardsDue = useMemo(
		() =>
			decks.sort(
				(a, b) =>
					(b.userData?.numberOfDueCards ?? 0) -
					(a.userData?.numberOfDueCards ?? 0)
			),
		[decks]
	)

	return (
		<Dashboard
			selection={Selection.Home}
			expectsSignIn={expectsSignIn}
			className="home"
		>
			<Head
				title="memorize.ai"
				breadcrumbs={url => [[{ name: 'Dashboard', url }]]}
			/>
			<div className="header">
				<div className="left">
					<h1 className="title">Hello, {currentUser?.name}</h1>
					<h3 className="subtitle">
						You have {dueCards ? formatNumber(dueCards) : 'no'} card
						{dueCards === 1 ? '' : 's'} due
					</h3>
					{dueCards > 0 && (
						<Link href="/review">
							<a className="review-button">Review all</a>
						</Link>
					)}
				</div>
				<Link href="/new">
					<a className="create-deck-link">
						<FontAwesomeIcon icon={faPlus} />
						<span>Create deck</span>
					</a>
				</Link>
			</div>
			<div className="activity-container">
				<h1>Activity</h1>
				<Activity className="activity" />
			</div>
			{decks.length === 0 || (
				<div className="my-decks">
					<h1>My decks</h1>
					<div className="decks">
						<div>
							{decksByCardsDue
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<OwnedDeckCell key={deck.id} deck={deck} />
								))}
						</div>
						<div>
							{decksByCardsDue
								.filter((_, i) => i & 1)
								.map(deck => (
									<OwnedDeckCell key={deck.id} deck={deck} />
								))}
						</div>
					</div>
				</div>
			)}
			{recommendedDecks.length === 0 || (
				<div className="recommended-decks">
					<h1>Recommended decks</h1>
					<div className="decks">
						<div>
							{recommendedDecks
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<DeckCell key={deck.id} deck={deck} />
								))}
						</div>
						<div>
							{recommendedDecks
								.filter((_, i) => i & 1)
								.map(deck => (
									<DeckCell key={deck.id} deck={deck} />
								))}
						</div>
					</div>
				</div>
			)}
		</Dashboard>
	)
}

export default DashboardHome
