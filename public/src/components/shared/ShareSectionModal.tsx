import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faLink } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../models/Deck'
import Section from '../../models/Section'
import Modal from './Modal'

import '../../scss/components/ShareSectionModal.scss'

export default (
	{ deck, section, isShowing, setIsShowing }: {
		deck: Deck
		section: Section | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const [didCopy, setDidCopy] = useState(false)
	
	return (
		<Modal
			className="share-section"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="header">
				<h2 className="title">
					Share unlock link
				</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</div>
			<div className="content">
				<p className="message">
					This link unlocks <span>{section?.name ?? '...'}</span> when visited.
				</p>
				<div className="box">
					<FontAwesomeIcon icon={faLink} />
					<p>https://memorize.ai/d/{deck.slug}/u/{section?.id ?? '...'}</p>
				</div>
				<CopyToClipboard
					text={`https://memorize.ai/d/${deck.slug}/u/${section?.id ?? '...'}`}
				>
					<button className="copy" onClick={() => setDidCopy(true)}>
						{didCopy ? 'Copied!' : 'Copy'}
					</button>
				</CopyToClipboard>
			</div>
		</Modal>
	)
}
