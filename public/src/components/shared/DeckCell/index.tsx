import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useAuthModal from '../../../hooks/useAuthModal'
import Base from './Base'
import Stars from '../Stars'
import Button from '../Button'
import { formatNumber, handleError } from '../../../utils'

import downloads from '../../../images/icons/download.svg'
import users from '../../../images/icons/users.svg'

import '../../../styles/components/DeckCell/index.scss'
import User from '../../../models/User'

export default ({ deck }: { deck: Deck }) => {
	const history = useHistory()
	
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
		history.push(`/decks/${deck.slugId}/${deck.slug}`)
	
	return (
		<Base
			className="default"
			deck={deck}
			href={deck.url}
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
					<img src={downloads} alt="Downloads" />
					<p>({formatNumber(deck.numberOfDownloads)})</p>
				</div>
				<div className="divider" />
				<div className="current-users">
					<img src={users} alt="Current users" />
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
