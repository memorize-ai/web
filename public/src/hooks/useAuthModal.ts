import { useContext, useCallback } from 'react'

import AuthModalContext from '../contexts/AuthModal'
import { setAuthModalIsShowing, setAuthModalCallback } from '../actions'
import { compose } from '../utils'

export default () => {
	const [{ isShowing, callback }, dispatch] = useContext(AuthModalContext)
	
	return [
		[isShowing, useCallback(compose(dispatch, setAuthModalIsShowing), [dispatch])],
		[callback, useCallback(compose(dispatch, setAuthModalCallback), [dispatch])]
	] as const
}
