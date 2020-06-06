import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const CramNavbar = (
	{ backUrl, currentCardIndex, totalCards, skip, recap }: {
		backUrl: string
		currentCardIndex: number
		totalCards: number
		skip: () => void
		recap: () => void
	}
) => (
	<div className="cram-navbar">
		<Link
			to={backUrl}
			className="back"
			onClick={event => event.stopPropagation()}
		>
			<FontAwesomeIcon icon={faTimes} />
		</Link>
		<p className="progress">
			{(currentCardIndex || -1) + 1} / {totalCards}
		</p>
		<button
			className="skip"
			onClick={event => {
				event.stopPropagation()
				skip()
			}}
		>
			Skip
		</button>
		<button
			className="recap"
			onClick={event => {
				event.stopPropagation()
				recap()
			}}
		>
			Recap
		</button>
	</div>
)

export default memo(CramNavbar)
