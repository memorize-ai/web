import { useMemo } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import formatNumber from 'lib/formatNumber'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useRecommendedDecks from 'hooks/useRecommendedDecks'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import Activity from 'components/Activity/CurrentUser'
import OwnedDeckCell from 'components/DeckCell/Owned'
import DeckCell from 'components/DeckCell'

import styles from './index.module.scss'

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
			className={styles.root}
			sidebarClassName={styles.sidebar}
			selection={Selection.Home}
			expectsSignIn={expectsSignIn}
		>
			<Head
				title="memorize.ai"
				breadcrumbs={url => [[{ name: 'Dashboard', url }]]}
			/>
			<div className={styles.header}>
				<div className={styles.left}>
					<h1 className={styles.title}>Hello, {currentUser?.name}</h1>
					<h3 className={styles.subtitle}>
						You have {dueCards ? formatNumber(dueCards) : 'no'} card
						{dueCards === 1 ? '' : 's'} due
					</h3>
					{dueCards > 0 && (
						<Link href="/review">
							<a className={styles.review}>Review all</a>
						</Link>
					)}
				</div>
				<Link href="/new">
					<a className={styles.new}>
						<FontAwesomeIcon className={styles.newIcon} icon={faPlus} />
						<span className={styles.newText}>Create deck</span>
					</a>
				</Link>
			</div>
			<div className={styles.activity}>
				<h1 className={styles.activityTitle}>Activity</h1>
				<div className={styles.activityContent}>
					<Activity />
				</div>
			</div>
			{decks.length === 0 || (
				<div className={styles.myDecks}>
					<h1 className={styles.decksTitle}>My decks</h1>
					<div className={styles.decks}>
						<div className={styles.decksRow}>
							{decksByCardsDue
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<OwnedDeckCell
										key={deck.id}
										className={styles.deck}
										deck={deck}
									/>
								))}
						</div>
						<div className={styles.decksRow}>
							{decksByCardsDue
								.filter((_, i) => i & 1)
								.map(deck => (
									<OwnedDeckCell
										key={deck.id}
										className={styles.deck}
										deck={deck}
									/>
								))}
						</div>
					</div>
				</div>
			)}
			{recommendedDecks.length === 0 || (
				<div className={styles.recommendedDecks}>
					<h1 className={styles.decksTitle}>Recommended decks</h1>
					<div className={styles.decks}>
						<div className={styles.decksRow}>
							{recommendedDecks
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<DeckCell key={deck.id} className={styles.deck} deck={deck} />
								))}
						</div>
						<div className={styles.decksRow}>
							{recommendedDecks
								.filter((_, i) => i & 1)
								.map(deck => (
									<DeckCell key={deck.id} className={styles.deck} deck={deck} />
								))}
						</div>
					</div>
				</div>
			)}
		</Dashboard>
	)
}

export default DashboardHome
