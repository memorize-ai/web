import { useContext } from 'react'

import SearchContext from 'context/Search'
import { setSearchState } from 'actions'
import { compose } from 'lib/utils'

export default () => {
	const [state, dispatch] = useContext(SearchContext)
	
	return [state, compose(dispatch, setSearchState)] as const
}
