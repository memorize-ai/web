import { useCallback } from 'react'

import { ModalShowingProps } from '..'
import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import ConfirmationModal from '../Confirmation'

export interface RemoveDeckModalProps extends ModalShowingProps {
	deck: Deck | null
}

const RemoveDeckModal = ({
	deck,
	isShowing,
	setIsShowing
}: RemoveDeckModalProps) => {
	const [currentUser] = useCurrentUser()

	const onConfirm = useCallback(() => {
		if (!(deck && currentUser)) return

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
}

export default RemoveDeckModal
