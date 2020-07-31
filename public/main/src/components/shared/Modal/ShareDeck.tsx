import React from 'react'

import { ModalShowingProps } from '.'
import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import ShareModal from './Share'

const ShareDeckModal = (
	{ deck, isShowing, setIsShowing }: {
		deck: Deck
	} & ModalShowingProps
) => {
	const [currentUser] = useCurrentUser()
	
	return (
		<ShareModal
			title={
				currentUser?.id === deck.creatorId
					? 'Promote your deck!'
					: 'Like this deck? Share it!'
			}
			url={deck.urlWithOrigin}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}

export default ShareDeckModal
