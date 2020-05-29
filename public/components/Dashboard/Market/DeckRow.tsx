import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'

import User from 'models/User'
import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useImageUrl from 'hooks/useImageUrl'
import useAuthModal from 'hooks/useAuthModal'
import Stars from 'components/shared/Stars'
import Button from 'components/shared/Button'
import { formatNumber, handleError } from 'lib/utils'

import UserIcon from 'images/icons/user.svg'
import DownloadIcon from 'images/icons/download.svg'
import UsersIcon from 'images/icons/users.svg'

export default ({ deck }: { deck: Deck }) => {
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()
	
	const [imageUrl] = useImageUrl(deck)
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	
	const hasDeck = decks.some(({ id }) => id === deck.id)
	
	const get = async () => {
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
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}
	
	const open = () =>
		Router.push(
			'/decks/[slugId]/[slug]',
			`/decks/${deck.slugId}/${deck.slug}`
		)
	
	return (
		<Link href="/d/[slugId]/[slug]" as={deck.url}>
			<a
				className="deck-row"
				itemScope
				itemID={deck.id}
				itemType="https://schema.org/IndividualProduct"
			>
				<img
					itemProp="image"
					src={imageUrl ?? Deck.DEFAULT_IMAGE_URL}
					alt={deck.name}
				/>
				<div className="content">
					<p className="name" itemProp="name">
						{deck.name}
					</p>
					<p className="subtitle">
						{deck.subtitle}
					</p>
					<p hidden itemProp="description">
						{deck.description}
					</p>
					{deck.creatorName && (
						<div className="creator">
							<UserIcon />
							<p>{deck.creatorName}</p>
						</div>
					)}
				</div>
				<div className="footer">
					<div className="stats">
						<div
							className="rating"
							itemProp="aggregateRating"
							itemScope
							itemType="https://schema.org/AggregateRating"
						>
							<meta itemProp="ratingValue" content={deck.averageRating.toString()} />
							<meta itemProp="reviewCount" content={(deck.numberOfRatings || 1).toString()} />
							<meta itemProp="worstRating" content={deck.worstRating.toString()} />
							<meta itemProp="bestRating" content={deck.bestRating.toString()} />
							<Stars>{deck.averageRating}</Stars>
							<p>({formatNumber(deck.numberOfRatings)})</p>
						</div>
						<div className="divider" />
						<div className="downloads">
							<DownloadIcon />
							<p>({formatNumber(deck.numberOfDownloads)})</p>
						</div>
						<div className="divider" />
						<div className="current-users">
							<UsersIcon />
							<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
						</div>
						<div className="divider" />
						<p className="cards">
							{formatNumber(deck.numberOfCards)} card{deck.numberOfCards === 1 ? '' : 's'}
						</p>
					</div>
					<Button
						className={hasDeck ? 'open' : 'get'}
						loaderSize="16px"
						loaderThickness="3px"
						loaderColor="white"
						loading={getLoadingState === LoadingState.Loading}
						disabled={false}
						onClick={event => {
							event.preventDefault()
							hasDeck ? open() : get()
						}}
					>
						{hasDeck ? 'Open' : 'Get'}
					</Button>
				</div>
			</a>
		</Link>
	)
}
