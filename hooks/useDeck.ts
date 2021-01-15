import { useEffect, useMemo } from 'react'
import { useRecoilState } from 'recoil'

import Deck from 'models/Deck'
import state from 'state/decks'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'

import 'firebase/firestore'

const firestore = firebase.firestore()

const useDeck = (slugId: string | undefined) => {
	const [{ decks, ownedDecks }, setState] = useRecoilState(state)

	const deck = useMemo(
		() =>
			slugId
				? ownedDecks.find(deck => deck.slugId === slugId) ??
				  decks.find(deck => deck.slugId === slugId)
				: undefined,
		[slugId, ownedDecks, decks]
	)

	const hasDeck = Boolean(deck)

	useEffect(() => {
		if (hasDeck || !slugId || Deck.observers.has(slugId)) return

		Deck.observers.add(slugId)

		firestore
			.collection('decks')
			.where('slugId', '==', slugId)
			.limit(1)
			.onSnapshot(snapshot => {
				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
						case 'modified':
							setState(state => ({
								...state,
								decks: state.decks.some(({ id }) => id === doc.id)
									? state.decks.map(deck =>
											deck.id === doc.id ? deck.updateFromSnapshot(doc) : deck
									  )
									: [...state.decks, Deck.fromSnapshot(doc)]
							}))
							break
						case 'removed':
							setState(state => ({
								...state,
								decks: state.decks.filter(({ id }) => id !== doc.id)
							}))
							break
					}
			}, handleError)
	}, [hasDeck, slugId, setState])

	return {
		deck: deck ?? null,
		hasDeck: ownedDecks.some(deck => deck.slugId === slugId)
	}
}

export default useDeck
