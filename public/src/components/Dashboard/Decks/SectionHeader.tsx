import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../../models/Deck'
import Section from '../../../models/Section'
import useCurrentUser from '../../../hooks/useCurrentUser'

export default ({ deck, section }: { deck: Deck, section: Section }) => {
	const [currentUser] = useCurrentUser()
	
	const isUnlocked = deck.isSectionUnlocked(section)
	
	const unlock = () =>
		currentUser && window.confirm(
			`Are you sure you want to unlock ${section.name}?`
		) && deck.unlockSectionForUserWithId(currentUser.id, section)
	
	return (
		<div className="header">
			{isUnlocked || (
				<button onClick={unlock}>
					<FontAwesomeIcon icon={faLock} />
				</button>
			)}
			<p className="name">{section.name}</p>
			<div className="spacer" />
			{isUnlocked && (
				<p className="card-count-message">
					({section.numberOfCards} card{section.numberOfCards === 1 ? '' : 's'})
				</p>
			)}
		</div>
	)
}
