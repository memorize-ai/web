import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { APP_STORE_URL } from 'lib/constants'
import { isIosHandheld } from 'lib/ios'
import introModalIsShowingState from 'state/introModalIsShowing'
import useAuthModal from './useAuthModal'

const useOnSignUp = () => {
	const setIntroModalIsShowing = useSetRecoilState(introModalIsShowingState)

	const { callback: authCallback } = useAuthModal()
	const authCallbackExists = Boolean(authCallback)

	return useCallback(() => {
		if (authCallbackExists) return

		if (isIosHandheld()) {
			window.location.href = APP_STORE_URL
			return
		}

		setIntroModalIsShowing(true)
	}, [authCallbackExists, setIntroModalIsShowing])
}

export default useOnSignUp
