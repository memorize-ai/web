import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faLink } from '@fortawesome/free-solid-svg-icons'

import Deck from '../../models/Deck'
import useCurrentUser from '../../hooks/useCurrentUser'
import Modal from './Modal'

import '../../scss/components/ShareDeckModal.scss'

export default (
	{ deck, isShowing, setIsShowing }: {
		deck: Deck
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const [currentUser] = useCurrentUser()
	const [didCopy, setDidCopy] = useState(false)
	
	return (
		<Modal
			className="share-deck"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="header">
				<h2 className="title">
					{currentUser?.id === deck.creatorId
						? 'Promote your deck!'
						: 'Like this deck? Share it!'
					}
				</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</div>
			<div className="content">
				<div className="box">
					<FontAwesomeIcon icon={faLink} />
					<p>https://memorize.ai/d/{deck.slug}</p>
				</div>
				<CopyToClipboard text={`https://memorize.ai/d/${deck.slug}`}>
					<button className="copy" onClick={() => setDidCopy(true)}>
						{didCopy ? 'Copied!' : 'Copy'}
					</button>
				</CopyToClipboard>
			</div>
		</Modal>
	)
}
