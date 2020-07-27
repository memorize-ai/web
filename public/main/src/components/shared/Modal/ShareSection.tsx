import React from 'react'

import { ModalShowingProps } from '.'
import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import ShareModal from './Share'

const ShareSectionModal = (
	{ deck, section, isShowing, setIsShowing }: {
		deck: Deck
		section: Section | null
	} & ModalShowingProps
) => (
	<ShareModal
		title="Share unlock link"
		message={<>This link unlocks <b>{section?.name ?? '...'}</b> when visited.</>}
		url={`${deck.urlWithOrigin}/u/${section?.id ?? '...'}`}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	/>
)

export default ShareSectionModal
