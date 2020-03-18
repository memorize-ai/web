import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { setIsObservingDecks, updateDeck, removeDeck } from '../../actions'
import { State } from '../../reducers'
import Deck from '../../models/Deck'
import useQuery from '../../hooks/useQuery'
import useCurrentUser from '../../hooks/useCurrentUser'

export interface CreateCardPopUpProps {
	isObservingDecks: boolean
	decks: Deck[]
	setIsObservingDecks: (value: boolean) => void
	updateDeck: (snapshot: firebase.firestore.DocumentSnapshot) => void
	removeDeck: (id: string) => void
}

const CreateCardPopUp = ({
	isObservingDecks,
	decks,
	setIsObservingDecks,
	updateDeck,
	removeDeck
}: CreateCardPopUpProps) => {
	const text = useQuery().get('text') ?? ''
	const [currentUser] = useCurrentUser()
	
	useEffect(() => {
		if (isObservingDecks || !currentUser)
			return
		
		setIsObservingDecks(true)
		Deck.observeForUserWithId(currentUser.uid, {
			updateDeck,
			removeDeck
		})
	}, [currentUser]) // eslint-disable-line
	
	return (
		<>
			<p>Choose a deck...</p>
			<ul>
				{decks
					.filter(deck => deck.creatorId === currentUser?.uid)
					.map(deck => (
						<li key={deck.id}>
							<Link to={`/create-card-pop-up/d/${deck.id}?text=${encodeURIComponent(text)}`}>
								{deck.name}
							</Link>
						</li>
					))
				}
			</ul>
		</>
	)
}

const mapStateToProps = ({ isObservingDecks, decks }: State) => ({
	isObservingDecks,
	decks
})

export default connect(mapStateToProps, {
	setIsObservingDecks,
	updateDeck,
	removeDeck
})(CreateCardPopUp)
