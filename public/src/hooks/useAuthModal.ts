import { useContext } from 'react'

import AuthModalContext from '../contexts/AuthModal'
import { setAuthModalIsShowing, setAuthModalCallback } from '../actions'
import { compose } from '../utils'

export default () => {
	const [{ isShowing, callback }, dispatch] = useContext(AuthModalContext)
	
	return [
		[isShowing, compose(dispatch, setAuthModalIsShowing)],
		[callback, compose(dispatch, setAuthModalCallback)]
	] as const
}
