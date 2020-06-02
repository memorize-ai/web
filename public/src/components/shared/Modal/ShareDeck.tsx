import React, { memo } from 'react'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import ShareModal from './Share'

const ShareDeckModal = (
	{ deck, isShowing, setIsShowing }: {
		deck: Deck
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
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

export default memo(ShareDeckModal)
