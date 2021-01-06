import { useEffect, useState } from 'react'

import useCurrentUser from './useCurrentUser'
import Deck from 'models/Deck'
import DeckSearch from 'models/Deck/Search'

const useRecommendedDecks = (pageSize: number) => {
	const [currentUser] = useCurrentUser()
	const [decks, setDecks] = useState([] as Deck[])
	
	const interestIds = currentUser?.interestIds
	
	useEffect(() => {
		if (!interestIds)
			return
		
		DeckSearch.recommendedDecks(pageSize, interestIds)
			.then(setDecks)
	}, [interestIds, pageSize])
	
	return decks
}

export default useRecommendedDecks
