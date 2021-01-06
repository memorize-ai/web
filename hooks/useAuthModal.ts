import { useContext, useCallback } from 'react'

import AuthModalContext from 'contexts/AuthModal'
import {
	setAuthModalIsShowing,
	setAuthModalCallback,
	setAuthModalMode,
	setAuthModalInitialXp
} from 'actions'
import { compose } from 'lib/utils'

const useAuthModal = () => {
	const [
		{ isShowing, callback, mode, initialXp },
		dispatch
	] = useContext(AuthModalContext)
	
	return {
		isShowing,
		setIsShowing: useCallback(compose(dispatch, setAuthModalIsShowing), [dispatch]),
		
		callback,
		setCallback: useCallback(compose(dispatch, setAuthModalCallback), [dispatch]),
		
		mode,
		setMode: useCallback(compose(dispatch, setAuthModalMode), [dispatch]),
		
		initialXp,
		setInitialXp: useCallback(compose(dispatch, setAuthModalInitialXp), [dispatch])
	}
}

export default useAuthModal
