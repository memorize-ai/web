import { useContext, useEffect } from 'react'

import DecksContext from '../contexts/Decks'
import { setDeckImageUrl, setDeckImageUrlLoadingState } from '../actions'
import Deck from '../models/Deck'
import LoadingState from '../models/LoadingState'
import { compose2 } from '../utils'

export default (deck: Deck) => {
	const [, dispatch] = useContext(DecksContext)
	
	useEffect(() => {
		if (deck.imageUrlLoadingState !== LoadingState.None)
			return
		
		deck.loadImageUrl({
			setDeckImageUrl: compose2(dispatch, setDeckImageUrl),
			setDeckImageUrlLoadingState: compose2(dispatch, setDeckImageUrlLoadingState)
		})
	}, [deck]) // eslint-disable-line
	
	return deck.imageUrl
}
