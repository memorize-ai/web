import React from 'react'

import useAuthModal from '../../../hooks/useAuthModal'
import AuthButton from '../../shared/AuthButton'

import '../../../scss/components/Home/PreviewClaimXPButton.scss'

const PreviewClaimXPButton = () => {
	const { initialXp } = useAuthModal()
	
	return (
		<AuthButton
			className="preview-claim-xp-button"
			signUp
			goToAppStoreIfHandheldIos
		>
			{initialXp > 0
				? `Claim ${initialXp} xp`
				: 'Start learning'
			}
		</AuthButton>
	)
}

export default PreviewClaimXPButton
