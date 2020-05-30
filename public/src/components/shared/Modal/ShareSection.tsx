import React from 'react'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import ShareModal from './Share'

export default (
	{ deck, section, isShowing, setIsShowing }: {
		deck: Deck
		section: Section | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => (
	<ShareModal
		title="Share unlock link"
		message={<>This link unlocks <b>{section?.name ?? '...'}</b> when visited.</>}
		url={`https://memorize.ai/d/${deck.slugId}/${deck.slug}/u/${section?.id ?? '...'}`}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	/>
)