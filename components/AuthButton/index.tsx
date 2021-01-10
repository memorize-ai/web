import { ButtonHTMLAttributes, useCallback, MouseEvent } from 'react'

import useAuthModal from 'hooks/useAuthModal'
import AuthenticationMode from 'models/AuthenticationMode'
import { APP_STORE_URL } from 'lib/constants'
import { isIosHandheld } from 'lib/utils'

export interface AuthButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	signUp?: boolean
	goToAppStoreIfHandheldIos?: boolean
}

const AuthButton = ({
	signUp = false,
	goToAppStoreIfHandheldIos = false,
	...props
}: AuthButtonProps) => {
	const { setIsShowing, setMode } = useAuthModal()

	const onClick = useCallback(
		(event: MouseEvent) => {
			event.stopPropagation()

			if (goToAppStoreIfHandheldIos && isIosHandheld()) {
				window.location.href = APP_STORE_URL
				return
			}

			if (signUp) setMode(AuthenticationMode.SignUp)

			setIsShowing(true)
		},
		[signUp, goToAppStoreIfHandheldIos, setMode, setIsShowing]
	)

	return <button {...props} onClick={onClick} />
}

export default AuthButton
