import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import useDecks from './useDecks'
import useCurrentUser from './useCurrentUser'
import LoadingState from '../models/LoadingState'

export default (slugId: string | undefined, slug: string | undefined) => {
	const history = useHistory()
	
	const [decks, decksLoadingState] = useDecks()
	const [currentUser] = useCurrentUser()
	
	return useMemo(() => {
		if (!((decksLoadingState === LoadingState.Success) && currentUser))
			return
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		if (!deck) {
			history.replace(`/d/${slugId}/${slug}`)
			return
		}
		
		if (deck.creatorId === currentUser?.id)
			return deck
		
		history.replace(`/decks/${slugId}/${slug}`)
	}, [decks, decksLoadingState, currentUser, slug, slugId, history]) ?? null
}
