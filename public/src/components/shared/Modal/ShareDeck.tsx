import React from 'react'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import ShareModal from './Share'

export default (
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
			url={`https://memorize.ai/d/${deck.slugId}/${deck.slug}`}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		/>
	)
}
