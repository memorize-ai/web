import React, { useCallback, memo } from 'react'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import ConfirmationModal from './Confirmation'

export interface RemoveDeckModalProps {
	deck: Deck | null
	isShowing: boolean
	setIsShowing: (isShowing: boolean) => void
}

const RemoveDeckModal = memo(({ deck, isShowing, setIsShowing }: RemoveDeckModalProps) => {
	const [currentUser] = useCurrentUser()
	
	const onConfirm = useCallback(() => {
		if (!(deck && currentUser))
			return
		
		deck.remove(currentUser.id)
		setIsShowing(false)
	}, [deck, currentUser, setIsShowing])
	
	return (
		<ConfirmationModal
			title="Remove deck from library"
			message="Are you sure? All progress will be deleted."
			onConfirm={onConfirm}
			buttonText="Remove"
			buttonBackground="#e53e3e"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
})

export default RemoveDeckModal
