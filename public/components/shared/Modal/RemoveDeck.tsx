import React from 'react'

import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import ConfirmationModal from './Confirmation'

export interface RemoveDeckModalProps {
	deck: Deck | null
	isShowing: boolean
	setIsShowing: (isShowing: boolean) => void
}

export default ({ deck, isShowing, setIsShowing }: RemoveDeckModalProps) => {
	const [currentUser] = useCurrentUser()
	
	return (
		<ConfirmationModal
			title="Remove deck from library"
			message="Are you sure? All progress will be deleted."
			onConfirm={() => {
				if (!(deck && currentUser))
					return
				
				deck.remove(currentUser.id)
				setIsShowing(false)
			}}
			buttonText="Remove"
			buttonBackground="#e53e3e"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}
