import { useState, useMemo } from 'react'
import Link from 'next/link'
import Img from 'react-optimized-image'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import LoadingState from 'models/LoadingState'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useDecks from 'hooks/useDecks'
import useCurrentUser from 'hooks/useCurrentUser'
import Input from 'components/Input'
import Section from '../SidebarSection'
import { isNullish, formatNumber, formatNumberAsInt } from 'lib/utils'

import logo from 'images/logos/capital.jpg'
import styles from './index.module.scss'

export interface DashboardSidebarProps {
	className: string
	expectsSignIn: boolean | undefined
}

const DashboardSidebar = ({
	className,
	expectsSignIn
}: DashboardSidebarProps) => {
	const isSignedIn = useLayoutAuthState() ?? expectsSignIn

	const [decks, decksLoadingState] = useDecks()
	const [currentUser] = useCurrentUser()

	const [query, setQuery] = useState('')

	const isLevelLoading = (isSignedIn ?? false) && isNullish(currentUser?.level)

	const level = isLevelLoading
		? '...'
		: formatNumberAsInt(currentUser?.level ?? 0)
	const nextLevel = isLevelLoading
		? '...'
		: formatNumberAsInt((currentUser?.level ?? 0) + 1)
	const xp =
		isSignedIn && isNullish(currentUser?.xp)
			? '...'
			: formatNumber(currentUser?.xp ?? 0)

	const sliderPercent = (currentUser?.percentToNextLevel ?? 0) * 100

	const hasNoDecks =
		!isSignedIn || (decksLoadingState === LoadingState.Success && !decks.length)

	const dueDecks = useMemo(
		() =>
			(decks ?? [])
				.filter(deck => deck.userData?.isDue ?? false)
				.sort(
					(a, b) =>
						(b.userData?.numberOfDueCards ?? 0) -
						(a.userData?.numberOfDueCards ?? 0)
				),
		[decks]
	)

	const favoriteDecks = useMemo(
		() =>
			(decks ?? [])
				.filter(deck => deck.userData?.isFavorite ?? false)
				.sort((a, b) => a.name.localeCompare(b.name)),
		[decks]
	)

	const allDecks = useMemo(
		() => (decks ?? []).sort((a, b) => a.name.localeCompare(b.name)),
		[decks]
	)

	return (
		<div className={cx(styles.root, className)}>
			<div className={styles.top}>
				<Link href="/">
					<a className={styles.home}>
						<Img className={styles.logo} src={logo} alt="Logo" webp />
					</a>
				</Link>
				<div className={styles.topDivider} />
				<Input
					className={styles.query}
					inputClassName={styles.queryInput}
					iconClassName={styles.queryIcon}
					icon={faSearch}
					type="name"
					placeholder="My decks"
					value={query}
					setValue={setQuery}
				/>
			</div>
			<div className={styles.sections}>
				{hasNoDecks ? (
					<p className={styles.emptyMessage}>Go on. Explore!</p>
				) : (
					<>
						<Section
							title="Due"
							decks={dueDecks}
							query={query}
							includesDivider
						/>
						<Section
							title="Favorites"
							decks={favoriteDecks}
							query={query}
							includesDivider
						/>
						<Section title="All" decks={allDecks} query={query} />
					</>
				)}
			</div>
			<div
				className={styles.bottom}
				aria-label="Earn XP by gaining popularity on your decks"
				data-balloon-pos="up"
			>
				<div className={styles.bottomDivider} />
				<div className={styles.bottomContent}>
					<p className={styles.stats}>
						<span className={styles.level}>lvl {level}</span>&nbsp;
						<span className={styles.statsBullet}>&bull;</span>&nbsp;
						<span className={styles.xp}>{xp} xp</span>
					</p>
					<div className={styles.sliderContainer}>
						<div className={styles.slider}>
							<div
								className={styles.sliderContent}
								style={{ width: `${sliderPercent}%` }}
							/>
						</div>
						<p className={styles.sliderValue}>lvl {nextLevel}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardSidebar
