import { useContext, useEffect } from 'react'

import SimilarDecksContext from '../contexts/SimilarDecks'
import { initializeSimilarDecks, setSimilarDecks } from '../actions'
import Deck from '../models/Deck'

export default (deck: Deck, chunkSize: number) => {
	const [{ [deck.id]: similarDecks }, dispatch] = useContext(SimilarDecksContext)
	
	useEffect(() => {
		if (similarDecks)
			return
		
		dispatch(initializeSimilarDecks(deck.id))
		
		deck.loadSimilarDecks(chunkSize)
			.then(newSimilarDecks =>
				dispatch(setSimilarDecks(deck.id, newSimilarDecks))
			)
	}, [similarDecks, deck, chunkSize]) // eslint-disable-line
	
	return similarDecks ?? []
}
