import { useContext, useEffect } from 'react'

import DeckImageUrlsContext from '../contexts/DeckImageUrls'
import Deck from '../models/Deck'
import LoadingState from '../models/LoadingState'
import { setDeckImageUrl, setDeckImageUrlLoadingState } from '../actions'
import { compose } from '../utils'

export default (deck: Deck | null | undefined) => {
	const [imageUrls, dispatch] = useContext(DeckImageUrlsContext)
	
	const state = (deck && imageUrls[deck.id]) ?? { url: null, loadingState: LoadingState.None }
	
	useEffect(() => {
		if (!(deck?.hasImage && state.loadingState === LoadingState.None))
			return
		
		deck?.loadImageUrl({
			setImageUrl: compose(dispatch, setDeckImageUrl),
			setImageUrlLoadingState: compose(dispatch, setDeckImageUrlLoadingState)
		})
	}, [deck, state.loadingState]) // eslint-disable-line
	
	return [state.url, state.loadingState] as const
}
