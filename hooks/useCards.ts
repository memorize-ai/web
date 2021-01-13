import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import cardsState from 'state/cards'
import Deck from 'models/Deck'
import Section from 'models/Section'
import Card from 'models/Card'
import useCurrentUser from './useCurrentUser'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'

import 'firebase/firestore'

const firestore = firebase.firestore()

type Entry = Card[] | undefined

const useCards = (deck: Deck, section: Section, shouldLoadCards: boolean) => {
	const [state, setState] = useRecoilState(cardsState)
	const [currentUser] = useCurrentUser()

	const uid = currentUser?.id
	const deckId = deck.id
	const sectionId = section.id
	const cards = state[section.id] as Entry

	useEffect(() => {
		if (!shouldLoadCards || !uid || Card.observers[sectionId] || cards) return

		Card.observers[section.id] = true

		firestore
			.collection(`decks/${deck.id}/cards`)
			.where('section', '==', sectionId)
			.onSnapshot(snapshot => {
				setState(state => ({ ...state, [sectionId]: state[sectionId] ?? [] }))

				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							setState(state => ({
								...state,
								[sectionId]: [
									...((state[sectionId] as Entry) ?? []),
									Card.fromSnapshot(doc)
								]
							}))

							Card.addSnapshotListener(
								doc.id,
								firestore
									.doc(`users/${uid}/decks/${deckId}/cards/${doc.id}`)
									.onSnapshot(userDataSnapshot => {
										setState(state => ({
											...state,
											[sectionId]: (state[sectionId] as Entry)?.filter(card =>
												card.id === doc.id
													? card.updateUserDataFromSnapshot(userDataSnapshot)
													: card
											)
										}))
									}, handleError)
							)

							break
						case 'modified':
							setState(state => ({
								...state,
								[sectionId]: (state[sectionId] as Entry)?.filter(card =>
									card.id === doc.id ? card.updateFromSnapshot(doc) : card
								)
							}))
							break
						case 'removed':
							Card.removeSnapshotListener(doc.id)
							setState(state => ({
								...state,
								[sectionId]: (state[sectionId] as Entry)?.filter(
									({ id }) => id !== doc.id
								)
							}))
							break
					}
			}, handleError)
	}, [shouldLoadCards, uid, deckId, sectionId, cards])

	return cards ?? null
}

export default useCards
