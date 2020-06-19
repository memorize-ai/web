import React, { ButtonHTMLAttributes, useCallback } from 'react'

import useAuthModal from '../../hooks/useAuthModal'
import { IS_IOS_HANDHELD, APP_STORE_URL } from '../../constants'

const AuthButton = (
	{ goToAppStoreIfHandheldIos = false, ...props }: {
		goToAppStoreIfHandheldIos?: boolean
	} & ButtonHTMLAttributes<HTMLButtonElement>
) => {
	const [[, setIsShowing]] = useAuthModal()
	
	const onClick = useCallback(() => {
		goToAppStoreIfHandheldIos && IS_IOS_HANDHELD
			? window.location.href = APP_STORE_URL
			: setIsShowing(true)
	}, [goToAppStoreIfHandheldIos, setIsShowing])
	
	return <button {...props} onClick={onClick} />
}

export default AuthButton
