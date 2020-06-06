import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const CramNavbar = (
	{ backUrl, currentCardIndex, totalCards }: {
		backUrl: string
		currentCardIndex: number
		totalCards: number
	}
) => (
	<div className="cram-navbar">
		<Link to={backUrl} className="back">
			<FontAwesomeIcon icon={faTimes} />
		</Link>
		<p className="progress">
			{(currentCardIndex || -1) + 1} / {totalCards}
		</p>
		<button className="skip">
			Skip
		</button>
		<button className="recap">
			Recap
		</button>
	</div>
)

export default memo(CramNavbar)
