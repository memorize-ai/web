import { useContext } from 'react'

import DecksContext from '../contexts/Decks'
import { setSelectedDeck } from '../actions'
import { compose } from '../utils'

export default () => {
	const [{ selectedDeck }, dispatch] = useContext(DecksContext)
	
	return [selectedDeck, compose(dispatch, setSelectedDeck)] as const
}
