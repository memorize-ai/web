import React from 'react'
import { faLink } from '@fortawesome/free-solid-svg-icons'

import { ModalShowingProps } from '.'
import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import CopyModal from './Copy'

const ShareSectionModal = (
	{ deck, section, isShowing, setIsShowing }: {
		deck: Deck
		section: Section | null
	} & ModalShowingProps
) => (
	<CopyModal
		title="Share unlock link"
		message={<>This link unlocks <b>{section?.name ?? '...'}</b> when visited.</>}
		icon={faLink}
		text={`${deck.urlWithOrigin}/u/${section?.id ?? '...'}`}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	/>
)

export default ShareSectionModal
