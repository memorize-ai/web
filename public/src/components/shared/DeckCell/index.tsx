import React, { MouseEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useAuthModal from '../../../hooks/useAuthModal'
import Base from './Base'
import Stars from '../Stars'
import Button from '../Button'
import { urlForDeckPage } from '../../Dashboard/DeckPage'
import { formatNumber } from '../../../utils'

import downloads from '../../../images/icons/download.svg'
import users from '../../../images/icons/users.svg'

import '../../../scss/components/DeckCell/index.scss'
import User from '../../../models/User'

export default ({ deck, onRemove }: { deck: Deck, onRemove: () => void }) => {
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const [decks] = useDecks()
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	
	const hasDeck = decks.some(({ id }) => id === deck.id)
	
	const get = async (event: MouseEvent) => {
		event.preventDefault()
		
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)
				
				await deck.get(user.id)
				
				setGetLoadingState(LoadingState.Success)
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				
				alert(error.message)
				console.error(error)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}
	
	const open = (event: MouseEvent) => {
		event.preventDefault()
		history.push(`/decks/${deck.slugId}/${deck.slug}`)
	}
	
	return (
		<Base
			className="default"
			deck={deck}
			href={urlForDeckPage(deck)}
			nameProps={{
				style: { WebkitLineClamp: deck.subtitle ? 1 : 2 }
			}}
		>
			<div className="stats">
				<div className="rating">
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
			<div className="buttons">
				{hasDeck
					? (
						<>
							<Button
								className="remove"
								loaderSize="16px"
								loaderThickness="3px"
								loaderColor="white"
								loading={getLoadingState === LoadingState.Loading}
								disabled={false}
								onClick={event => {
									event.preventDefault()
									onRemove()
								}}
							>
								Remove
							</Button>
							<Button
								className="open"
								loading={false}
								disabled={false}
								onClick={open}
							>
								Open
							</Button>
						</>
					)
					: (
						<Button
							className="get"
							loaderSize="16px"
							loaderThickness="3px"
							loaderColor="white"
							loading={getLoadingState === LoadingState.Loading}
							disabled={false}
							onClick={get}
						>
							Get
						</Button>
					)
				}
			</div>
		</Base>
	)
}
