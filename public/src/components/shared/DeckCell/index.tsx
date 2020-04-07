import React, { MouseEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import Base from './Base'
import Stars from '../Stars'
import Button from '../Button'
import { urlWithQuery, formatNumber } from '../../../utils'

import downloads from '../../../images/icons/download.svg'
import users from '../../../images/icons/users.svg'

import '../../../scss/components/DeckCell/index.scss'

export default ({ deck }: { deck: Deck }) => {
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const decks = useDecks()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	
	const hasDeck = decks.some(({ id }) => id === deck.id)
	
	const get = async (event: MouseEvent) => {
		event.preventDefault()
		
		if (!currentUser)
			return history.push(urlWithQuery('/auth', {
				title: 'I heard that deck is great...',
				next: `/d/${deck.slug}`
			}))
		
		try {
			setGetLoadingState(LoadingState.Loading)
			
			await deck[hasDeck ? 'remove' : 'get'](currentUser.id)
			
			setGetLoadingState(LoadingState.Success)
		} catch (error) {
			setGetLoadingState(LoadingState.Fail)
			
			alert(error.message)
			console.error(error)
		}
	}
	
	const open = (event: MouseEvent) => {
		event.preventDefault()
		history.push(`/decks/${deck.slug}`)
	}
	
	return (
		<Base className="default" deck={deck} href={`/d/${deck.slug}`}>
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
								onClick={get}
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
