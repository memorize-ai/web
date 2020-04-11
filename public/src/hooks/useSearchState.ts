import { useContext } from 'react'

import SearchContext from '../contexts/Search'
import { setSearchState } from '../actions'
import { compose } from '../utils'

export default () => {
	const [state, dispatch] = useContext(SearchContext)
	
	return [state, compose(dispatch, setSearchState)] as const
}
