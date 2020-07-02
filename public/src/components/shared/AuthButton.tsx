import React, { ButtonHTMLAttributes, useCallback } from 'react'

import useAuthModal from '../../hooks/useAuthModal'
import AuthenticationMode from '../../models/AuthenticationMode'
import { IS_IOS_HANDHELD, APP_STORE_URL } from '../../constants'

const AuthButton = (
	{ signUp = false, goToAppStoreIfHandheldIos = false, ...props }: {
		signUp?: boolean
		goToAppStoreIfHandheldIos?: boolean
	} & ButtonHTMLAttributes<HTMLButtonElement>
) => {
	const { setIsShowing, setMode } = useAuthModal()
	
	const onClick = useCallback(() => {
		if (goToAppStoreIfHandheldIos && IS_IOS_HANDHELD) {
			window.location.href = APP_STORE_URL
			return
		}
		
		if (signUp)
			setMode(AuthenticationMode.SignUp)
		
		setIsShowing(true)
	}, [signUp, goToAppStoreIfHandheldIos, setMode, setIsShowing])
	
	return <button {...props} onClick={onClick} />
}

export default AuthButton
