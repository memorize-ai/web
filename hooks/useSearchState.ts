import { useContext, useCallback } from 'react'

import SearchContext from 'contexts/Search'
import { setSearchState } from 'actions'
import { compose } from 'lib/utils'

const useSearchState = () => {
	const [state, dispatch] = useContext(SearchContext)
	const setState = useCallback(compose(dispatch, setSearchState), [dispatch])
	
	return [state, setState] as const
}

export default useSearchState
