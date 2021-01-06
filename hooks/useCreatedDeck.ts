import { useMemo } from 'react'
import Router from 'next/router'

import useDecks from './useDecks'
import useCurrentUser from './useCurrentUser'
import LoadingState from 'models/LoadingState'

const useCreatedDeck = (slugId: string | undefined, slug: string | undefined) => {
	const [decks, decksLoadingState] = useDecks()
	const [currentUser] = useCurrentUser()
	
	return useMemo(() => {
		if (!(slugId && slug && decksLoadingState === LoadingState.Success && currentUser))
			return
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		if (!deck) {
			Router.replace(`/d/${slugId}/${slug}`)
			return
		}
		
		if (deck.creatorId === currentUser?.id)
			return deck
		
		Router.replace(`/decks/${slugId}/${slug}`)
	}, [slugId, slug, decks, decksLoadingState, currentUser]) ?? null
}

export default useCreatedDeck
