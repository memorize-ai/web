import { useEffect, useState } from 'react'

import useCurrentUser from './useCurrentUser'
import Deck from '../models/Deck'
import DeckSearch from '../models/Deck/Search'

export default (pageSize: number) => {
	const [currentUser] = useCurrentUser()
	const [decks, setDecks] = useState([] as Deck[])
	
	useEffect(() => void (async () => {
		if (!currentUser?.interestIds)
			return
		
		setDecks(await DeckSearch.recommendedDecks(pageSize, currentUser.interestIds))
	})(), [currentUser?.interestIds]) // eslint-disable-line
	
	return decks
}
