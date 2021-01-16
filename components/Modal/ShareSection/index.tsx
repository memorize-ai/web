import { faLink } from '@fortawesome/free-solid-svg-icons'

import { ModalShowingProps } from '..'
import Deck from 'models/Deck'
import Section from 'models/Section'
import CopyModal from '../Copy'

export interface ShareSectionModalProps extends ModalShowingProps {
	deck: Deck
	section: Section | null
}

const ShareSectionModal = ({
	deck,
	section,
	isShowing,
	setIsShowing
}: ShareSectionModalProps) => (
	<CopyModal
		title="Share unlock link"
		message={
			<>
				This link unlocks <b>{section?.name ?? '...'}</b> when visited.
			</>
		}
		icon={faLink}
		text={`${deck.urlWithOrigin}/u/${section?.id ?? 'error'}`}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	/>
)

export default ShareSectionModal
