import { useContext } from 'react'

import DecksContext from 'context/Decks'
import { setSelectedDeck } from 'actions'
import { compose } from 'lib/utils'

export default () => {
	const [{ selectedDeck }, dispatch] = useContext(DecksContext)
	
	return [selectedDeck, compose(dispatch, setSelectedDeck)] as const
}
