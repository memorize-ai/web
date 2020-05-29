import { useMemo } from 'react'
import { useRouter } from 'next/router'

import useDecks from './useDecks'
import useCurrentUser from './useCurrentUser'
import LoadingState from 'models/LoadingState'

export default (slugId: string | undefined, slug: string | undefined) => {
	const router = useRouter()
	
	const [decks, decksLoadingState] = useDecks()
	const [currentUser] = useCurrentUser()
	
	return useMemo(() => {
		if (!((decksLoadingState === LoadingState.Success) && currentUser))
			return
		
		const deck = decks.find(deck => deck.slugId === slugId)
		
		if (!deck) {
			router.replace(`/d/${slugId}/${slug}`)
			return
		}
		
		if (deck.creatorId === currentUser?.id)
			return deck
		
		router.replace(`/decks/${slugId}/${slug}`)
	}, [decks, decksLoadingState, currentUser, slug, slugId]) ?? null
}
