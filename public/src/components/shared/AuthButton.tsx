import React, { HTMLAttributes } from 'react'

import useAuthModal from '../../hooks/useAuthModal'

const AuthButton = (props: HTMLAttributes<HTMLButtonElement>) => {
	const [[, setIsShowing]] = useAuthModal()
	
	return <button {...props} onClick={() => setIsShowing(true)} />
}

export default AuthButton
