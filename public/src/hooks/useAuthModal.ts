import { useContext, useMemo } from 'react'

import AuthModalContext from '../contexts/AuthModal'
import { setAuthModalIsShowing, setAuthModalCallback } from '../actions'
import { compose } from '../utils'

export default () => {
	const [{ isShowing, callback }, dispatch] = useContext(AuthModalContext)
	
	return [
		[isShowing, useMemo(() => compose(dispatch, setAuthModalIsShowing), [dispatch])],
		[callback, useMemo(() => compose(dispatch, setAuthModalCallback), [dispatch])]
	] as const
}
