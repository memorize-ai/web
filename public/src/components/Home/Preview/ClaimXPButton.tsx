import React from 'react'

import useAuthModal from '../../../hooks/useAuthModal'
import AuthButton from '../../shared/AuthButton'

import '../../../scss/components/Home/PreviewClaimXPButton'

const PreviewClaimXPButton = () => {
	const { initialXp } = useAuthModal()
	
	return (
		<AuthButton className="claim-xp-button" signUp goToAppStoreIfHandheldIos>
			{initialXp > 0
				? <>Claim <b>{initialXp} xp</b></>
				: 'Continue learning'
			}
		</AuthButton>
	)
}

export default PreviewClaimXPButton
