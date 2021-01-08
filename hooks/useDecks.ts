import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Deck from 'models/Deck'
import LoadingState from 'models/LoadingState'
import state from 'state/decks'
import useCurrentUser from './useCurrentUser'
import firebase from 'lib/firebase'
import { handleError } from 'lib/utils'

import 'firebase/firestore'
import DeckUserData from 'models/Deck/UserData'

const firestore = firebase.firestore()

const useDecks = () => {
	const [{ ownedDecks, loadingState }, setState] = useRecoilState(state)
	const [currentUser] = useCurrentUser()

	const uid = currentUser?.id

	useEffect(() => {
		if (!uid || Deck.isObservingOwned[uid]) return

		Deck.isObservingOwned[uid] = true

		setState(state => ({ ...state, loadingState: LoadingState.Loading }))

		firestore.collection(`users/${uid}/decks`).onSnapshot(
			snapshot => {
				const changes = snapshot.docChanges()

				if (!changes.length)
					return setState(state => ({
						...state,
						loadingState: LoadingState.Success
					}))

				let pendingAdded = 0

				const updatePendingAdded = (amount: 1 | -1) => {
					pendingAdded += amount

					if (pendingAdded <= 0)
						setState(state => ({
							...state,
							loadingState: LoadingState.Success
						}))
				}

				for (const { type, doc: userDataSnapshot } of changes)
					switch (type) {
						case 'added':
							updatePendingAdded(1)

							Deck.addSnapshotListener(
								userDataSnapshot.id,
								firestore
									.doc(`decks/${userDataSnapshot.id}`)
									.onSnapshot(snapshot => {
										setState(state => {
											const ownedDecks = state.ownedDecks.some(
												({ id }) => id === snapshot.id
											)
												? state.ownedDecks.map(deck =>
														deck.id === snapshot.id
															? deck.updateFromSnapshot(snapshot)
															: deck
												  )
												: [
														...state.ownedDecks,
														Deck.fromSnapshot(
															snapshot,
															DeckUserData.fromSnapshot(userDataSnapshot)
														)
												  ]

											return {
												...state,
												ownedDecks,
												selectedDeck:
													state.selectedDeck ?? ownedDecks[0] ?? null
											}
										})

										updatePendingAdded(-1)
									}, handleError)
							)

							break
						case 'modified':
							setState(state => ({
								...state,
								ownedDecks: state.ownedDecks.map(deck =>
									deck.id === userDataSnapshot.id
										? deck.updateUserDataFromSnapshot(userDataSnapshot)
										: deck
								)
							}))
							break
						case 'removed':
							Deck.removeSnapshotListener(userDataSnapshot.id)
							setState(state => ({
								...state,
								ownedDecks: state.ownedDecks.filter(
									({ id }) => id !== userDataSnapshot.id
								),
								selectedDeck:
									state.selectedDeck?.id === userDataSnapshot.id
										? ownedDecks[0] ?? null
										: state.selectedDeck
							}))
							break
					}
			},
			error => {
				setState(state => ({
					...state,
					loadingState: LoadingState.Fail
				}))
				handleError(error)
			}
		)
	}, [uid, setState])

	return [ownedDecks, loadingState] as const
}

export default useDecks
