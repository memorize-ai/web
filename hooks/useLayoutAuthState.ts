import { useState } from 'react'

import useAuthState from './useAuthState'
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

/** Layout safe version of `useAuthState` */
const useLayoutAuthState = () => {
	const [state, setState] = useState<boolean | null>(null)
	const _state = useAuthState()

	useIsomorphicLayoutEffect(() => {
		setState(_state)
	}, [_state, setState])

	return state
}

export default useLayoutAuthState
