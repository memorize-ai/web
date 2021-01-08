import { useState } from 'react'

import useAuthState from './useAuthState'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

/** Layout safe version of `useAuthState` */
const useLayoutAuthState = () => {
	const _state = useAuthState()
	const [state, setState] = useState(_state)

	useIsomorphicLayoutEffect(() => {
		setState(_state)
	}, [_state, setState])

	return state
}

export default useLayoutAuthState
