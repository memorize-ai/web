import React, { HTMLAttributes } from 'react'

import useAuthModal from '../../hooks/useAuthModal'

export default (props: HTMLAttributes<HTMLButtonElement>) => {
	const [[, setIsShowing]] = useAuthModal()
	
	return <button {...props} onClick={() => setIsShowing(true)} />
}
