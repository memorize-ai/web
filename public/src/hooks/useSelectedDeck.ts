import { useContext } from 'react'

import DecksContext from '../contexts/Decks'
import Deck from '../models/Deck'
import { setSelectedDeck } from '../actions'
import { compose } from '../utils'

export default (): [Deck | null, (deck: Deck) => void] => {
	const [{ selectedDeck }, dispatch] = useContext(DecksContext)
	
	return [selectedDeck, compose(dispatch, setSelectedDeck)]
}
