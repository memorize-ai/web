import { faLink } from '@fortawesome/free-solid-svg-icons'

import { ModalShowingProps } from '.'
import Deck from 'models/Deck'
import useCurrentUser from 'hooks/useCurrentUser'
import CopyModal from './Copy'

const ShareDeckModal = ({
	deck,
	isShowing,
	setIsShowing
}: {
	deck: Deck
} & ModalShowingProps) => {
	const [currentUser] = useCurrentUser()

	return (
		<CopyModal
			title={
				currentUser?.id === deck.creatorId
					? 'Promote your deck!'
					: 'Like this deck? Share it!'
			}
			icon={faLink}
			text={deck.urlWithOrigin}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}

export default ShareDeckModal
