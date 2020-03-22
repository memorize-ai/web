import { useEffect, useState } from 'react'

import useCurrentUser from './useCurrentUser'
import Deck from '../models/Deck'
import DeckSearch from '../models/Deck/Search'

export default () => {
	const [currentUser] = useCurrentUser()
	const [decks, setDecks] = useState([] as Deck[])
	
	useEffect(() => void (async () => {
		if (!currentUser?.interestIds)
			return
		
		setDecks(await DeckSearch.recommendedDecks(currentUser.interestIds))
	})(), [currentUser?.interestIds])
	
	return decks
}
