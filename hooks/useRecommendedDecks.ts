import { useEffect, useState } from 'react'

import useCurrentUser from './useCurrentUser'
import Deck from 'models/Deck'
import DeckSearch from 'models/Deck/Search'
import handleError from 'lib/handleError'

const useRecommendedDecks = (pageSize: number) => {
	const [currentUser] = useCurrentUser()
	const [decks, setDecks] = useState([] as Deck[])

	const interestIds = currentUser?.interestIds

	useEffect(() => {
		if (!interestIds) return

		DeckSearch.recommendedDecks(pageSize, interestIds)
			.then(setDecks)
			.catch(handleError)
	}, [interestIds, pageSize])

	return decks
}

export default useRecommendedDecks
