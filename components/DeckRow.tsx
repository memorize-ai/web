import { useState, useCallback, MouseEvent, useMemo } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Svg } from 'react-optimized-image'

import User from 'models/User'
import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useAuthModal from 'hooks/useAuthModal'
import Stars from 'components/Stars'
import Button from 'components/Button'
import { formatNumber, handleError } from 'lib/utils'

import { src as defaultImage } from 'images/logos/icon.jpg'
import user from 'images/icons/user.svg'
import download from 'images/icons/download.svg'
import users from 'images/icons/users.svg'

const MarketDeckRow = ({ deck }: { deck: Deck }) => {
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
				className="deck-row"
				itemScope
				itemID={deck.id}
				itemType="https://schema.org/IndividualProduct"
			>
				<img
					itemProp="image"
					src={deck.imageUrl ?? defaultImage}
					alt={deck.name}
					loading="lazy"
				/>
				<span className="content">
					<span className="name" itemProp="name">
						{deck.name}
					</span>
					<span className="subtitle">{deck.subtitle}</span>
					<span hidden itemProp="description">
						{deck.description}
					</span>
					{deck.creatorName && (
						<span className="creator">
							<Svg src={user} />
							<span>{deck.creatorName}</span>
						</span>
					)}
				</span>
				<span className="footer">
					<span className="stats">
						<span
							className="rating"
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
							<span>({formatNumber(deck.numberOfRatings)})</span>
						</span>
						<span className="divider" />
						<span className="downloads">
							<Svg src={download} />
							<span>({formatNumber(deck.numberOfDownloads)})</span>
						</span>
						<span className="divider" />
						<span className="current-users">
							<Svg src={users} />
							<span>({formatNumber(deck.numberOfCurrentUsers)})</span>
						</span>
						<span className="divider" />
						<span className="cards">
							{formatNumber(deck.numberOfCards)} card
							{deck.numberOfCards === 1 ? '' : 's'}
						</span>
					</span>
					<Button
						className={hasDeck ? 'open' : 'get'}
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
