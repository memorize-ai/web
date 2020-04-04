import { useContext, useEffect } from 'react'

import DeckImageUrlsContext from '../contexts/DeckImageUrls'
import Deck from '../models/Deck'
import LoadingState from '../models/LoadingState'
import { setDeckImageUrl, setDeckImageUrlLoadingState } from '../actions'
import { compose } from '../utils'

export default (deck: Deck): [string | null, LoadingState] => {
	const [{ [deck.id]: _state }, dispatch] = useContext(DeckImageUrlsContext)
	
	const state = _state ?? { url: null, loadingState: LoadingState.None }
	
	useEffect(() => {
		if (!(deck.hasImage && state.loadingState === LoadingState.None))
			return
		
		deck.loadImageUrl({
			setImageUrl: compose(dispatch, setDeckImageUrl),
			setImageUrlLoadingState: compose(dispatch, setDeckImageUrlLoadingState)
		})
	}, [deck.hasImage, state.loadingState])
	
	return [state.url, state.loadingState]
}
