import { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import AuthenticationMode from 'models/AuthenticationMode'
import authModalState from 'state/authModal'

const useAuthModal = () => {
	const [{ isShowing, callback, mode, initialXp }, setState] = useRecoilState(
		authModalState
	)

	return {
		isShowing,
		setIsShowing: useCallback(
			(isShowing: boolean) => {
				setState(state => ({ ...state, isShowing }))
			},
			[setState]
		),
		callback,
		setCallback: useCallback(
			(callback: ((user: User) => void) | null) => {
				setState(state => ({ ...state, callback }))
			},
			[setState]
		),
		mode,
		setMode: useCallback(
			(mode: AuthenticationMode) => {
				setState(state => ({ ...state, mode }))
			},
			[setState]
		),
		initialXp,
		setInitialXp: useCallback(
			(initialXp: number) => {
				setState(state => ({ ...state, initialXp }))
			},
			[setState]
		)
	}
}

export default useAuthModal
