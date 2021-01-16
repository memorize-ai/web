import { useState, useCallback, MouseEvent, useMemo } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import User from 'models/User'
import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useAuthModal from 'hooks/useAuthModal'
import Stars from 'components/Stars'
import Button from 'components/Button'
import formatNumber from 'lib/formatNumber'
import handleError from 'lib/handleError'

import { src as defaultImage } from 'images/defaults/deck.jpg'
import defaultUserImage from 'images/defaults/user.svg'
import download from 'images/icons/download.svg'
import users from 'images/icons/users.svg'

import styles from './index.module.scss'

export interface MarketDeckRowProps {
	deck: Deck
}

const MarketDeckRow = ({ deck }: MarketDeckRowProps) => {
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()

	const {
		setIsShowing: setAuthModalIsShowing,
		setCallback: setAuthModalCallback
	} = useAuthModal()

	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)

	const hasDeck = useMemo(() => decks.some(({ id }) => id === deck.id), [
		decks,
		deck
	])

	const viewCreator = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault()

			if (!deck.creator) return
			const { slugId, slug } = deck.creator

			Router.push(`/u/${slugId}/${slug}`)
		},
		[deck.creator]
	)

	const get = useCallback(async () => {
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)

				await deck.get(user.id)

				setGetLoadingState(LoadingState.Success)
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}

		if (currentUser) callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}, [
		currentUser,
		setGetLoadingState,
		deck,
		setAuthModalIsShowing,
		setAuthModalCallback
	])

	const open = useCallback(() => {
		Router.push(`/decks/${deck.slugId}/${encodeURIComponent(deck.slug)}`)
	}, [deck])

	const action = useCallback(
		(event: MouseEvent) => {
			event.preventDefault()
			hasDeck ? open() : get()
		},
		[hasDeck, open, get]
	)

	return (
		<Link href={deck.url}>
			<a
				className={styles.root}
				itemScope
				itemID={deck.id}
				itemType="https://schema.org/IndividualProduct"
			>
				<img
					className={styles.image}
					itemProp="image"
					src={deck.imageUrl ?? defaultImage}
					alt={deck.name}
					loading="lazy"
				/>
				<span className={styles.content}>
					<span className={styles.name} itemProp="name">
						{deck.name}
					</span>
					<span className={styles.subtitle}>{deck.subtitle}</span>
					<span hidden itemProp="description">
						{deck.description}
					</span>
					{deck.creator && (
						<button className={styles.creator} onClick={viewCreator}>
							{deck.creatorImage ? (
								<img
									className={styles.creatorImage}
									src={deck.creatorImage}
									alt={deck.creator.name}
								/>
							) : (
								<Svg
									className={styles.creatorDefaultImage}
									src={defaultUserImage}
									viewBox={`0 0 ${defaultUserImage.width} ${defaultUserImage.height}`}
								/>
							)}
							<span className={styles.creatorName}>{deck.creator.name}</span>
							<FontAwesomeIcon
								className={styles.creatorIcon}
								icon={faChevronRight}
							/>
						</button>
					)}
				</span>
				<span className={styles.footer}>
					<span className={styles.stats}>
						<span
							className={styles.rating}
							itemProp="aggregateRating"
							itemScope
							itemType="https://schema.org/AggregateRating"
						>
							<meta
								itemProp="ratingValue"
								content={deck.averageRating.toString()}
							/>
							<meta
								itemProp="reviewCount"
								content={(deck.numberOfRatings || 1).toString()}
							/>
							<meta
								itemProp="worstRating"
								content={deck.worstRating.toString()}
							/>
							<meta
								itemProp="bestRating"
								content={deck.bestRating.toString()}
							/>
							<Stars>{deck.averageRating}</Stars>
							<span className={styles.statText}>
								({formatNumber(deck.numberOfRatings)})
							</span>
						</span>
						<span className={styles.divider} />
						<span className={styles.downloads}>
							<Svg className={styles.statIcon} src={download} />
							<span className={styles.statText}>
								({formatNumber(deck.numberOfDownloads)})
							</span>
						</span>
						<span className={styles.divider} />
						<span className={styles.users}>
							<Svg className={styles.statIcon} src={users} />
							<span className={styles.statText}>
								({formatNumber(deck.numberOfCurrentUsers)})
							</span>
						</span>
						<span className={styles.divider} />
						<span className={styles.cards}>
							{formatNumber(deck.numberOfCards)} card
							{deck.numberOfCards === 1 ? '' : 's'}
						</span>
					</span>
					<Button
						className={styles[hasDeck ? 'open' : 'get']}
						loaderSize="16px"
						loaderThickness="3px"
						loaderColor="white"
						loading={getLoadingState === LoadingState.Loading}
						disabled={false}
						onClick={action}
					>
						{hasDeck ? 'Open' : 'Get'}
					</Button>
				</span>
			</a>
		</Link>
	)
}

export default MarketDeckRow
