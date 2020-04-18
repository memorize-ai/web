import React from 'react'

import Deck from '../../models/Deck'
import Section from '../../models/Section'
import useCurrentUser from '../../hooks/useCurrentUser'
import Modal from './Modal'

import { ReactComponent as TimesIcon } from '../../images/icons/times.svg'

import '../../scss/components/UnlockSectionModal.scss'

export default (
	{ deck, section, isShowing, setIsShowing }: {
		deck: Deck
		section: Section | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const [currentUser] = useCurrentUser()
	
	return (
		<Modal
			className="unlock-section"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="header">
				<h2 className="title">
					Unlock section
				</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<TimesIcon />
				</button>
			</div>
			<div className="content">
				<p>Are you sure you want to unlock <span>{section?.name ?? '...'}</span>?</p>
				<button onClick={() => {
					if (!(currentUser && section))
						return
					
					deck.unlockSectionForUserWithId(currentUser.id, section)
					setIsShowing(false)
				}}>
					Unlock
				</button>
			</div>
		</Modal>
	)
}
