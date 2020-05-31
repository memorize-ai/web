import { useContext, useCallback } from 'react'

import DecksContext from '../contexts/Decks'
import { setSelectedDeck } from '../actions'
import { compose } from '../utils'

export default () => {
	const [{ selectedDeck }, dispatch] = useContext(DecksContext)
	const setDeck = useCallback(compose(dispatch, setSelectedDeck), [dispatch])
	
	return [selectedDeck, setDeck] as const
}
