import React, { useState } from 'react'
import Router from 'next/router'

import Deck from 'models/Deck'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import useCurrentUser from 'hooks/useCurrentUser'
import useDecks from 'hooks/useDecks'
import useAuthModal from 'hooks/useAuthModal'
import Base from './Base'
import Stars from '../Stars'
import Button from '../Button'
import { formatNumber, handleError } from 'lib/utils'

import DownloadsIcon from 'images/icons/download.svg'
import UsersIcon from 'images/icons/users.svg'

import '../../../scss/components/DeckCell/index.scss'

export default ({ deck }: { deck: Deck }) => {
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()
	
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
		<Base
			className="default"
			deck={deck}
			href="/d/[slugId]/[slug]"
			as={deck.url}
			nameProps={{
				style: { WebkitLineClamp: deck.subtitle ? 1 : 2 }
			}}
		>
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
					<DownloadsIcon />
					<p>({formatNumber(deck.numberOfDownloads)})</p>
				</div>
				<div className="divider" />
				<div className="current-users">
					<UsersIcon />
					<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
				</div>
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
		</Base>
	)
}
