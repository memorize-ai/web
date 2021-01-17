import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import state from 'state/similarDecks'
import Deck from 'models/Deck'
import handleError from 'lib/handleError'

const useSimilarDecks = (deck: Deck, chunkSize: number) => {
	const [similarDecks, setSimilarDecks] = useRecoilState(state(deck.id))
	const didLoad = Boolean(similarDecks)

	useEffect(() => {
		if (didLoad || Deck.similarDeckObservers.has(deck.id)) return

		Deck.similarDeckObservers.add(deck.id)
		deck.loadSimilarDecks(chunkSize).then(setSimilarDecks).catch(handleError)
	}, [didLoad, deck, chunkSize, setSimilarDecks])

	return similarDecks
}

export default useSimilarDecks
