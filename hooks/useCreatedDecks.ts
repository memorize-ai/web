import { useMemo, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import Deck from 'models/Deck'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import { VIEWABLE_CREATED_DECK_LIMIT } from 'lib/constants'
import createdDecksState from 'state/createdDecks'
import useDecks from './useDecks'

import 'firebase/firestore'

const firestore = firebase.firestore()

const useCreatedDecks = (uid: string, initialDecks: Deck[]) => {
	const [createdDecks, setCreatedDecks] = useRecoilState(createdDecksState(uid))
	const [ownedDecks] = useDecks()

	const decks = createdDecks ?? initialDecks

	useEffect(() => {
		firestore
			.collection('decks')
			.where('creator', '==', uid)
			.orderBy('currentUserCount', 'desc')
			.limit(VIEWABLE_CREATED_DECK_LIMIT)
			.onSnapshot(snapshot => {
				setCreatedDecks(decks => decks ?? [])

				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							setCreatedDecks(decks => [
								...(decks ?? []),
								Deck.fromSnapshot(doc)
							])
							break
						case 'modified':
							setCreatedDecks(decks =>
								(decks ?? []).map(deck =>
									deck.id === doc.id ? deck.updateFromSnapshot(doc) : deck
								)
							)
							break
						case 'removed':
							setCreatedDecks(decks =>
								(decks ?? []).filter(deck => deck.id !== doc.id)
							)
							break
					}
			}, handleError)
	}, [uid, setCreatedDecks])

	return useMemo(
		() =>
			decks.map(deck => ownedDecks.find(({ id }) => id === deck.id) ?? deck),
		[decks, ownedDecks]
	)
}

export default useCreatedDecks
