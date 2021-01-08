import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import state from 'state/similarDecks'
import Deck from 'models/Deck'

const useSimilarDecks = (deck: Deck, chunkSize: number) => {
	const [similarDecks, setSimilarDecks] = useRecoilState(state(deck.id))
	const didLoad = Boolean(similarDecks)

	useEffect(() => {
		if (didLoad || Deck.similarDeckObservers[deck.id]) return

		Deck.similarDeckObservers[deck.id] = true
		deck.loadSimilarDecks(chunkSize).then(setSimilarDecks)
	}, [didLoad, deck, chunkSize, setSimilarDecks])

	return similarDecks
}

export default useSimilarDecks
