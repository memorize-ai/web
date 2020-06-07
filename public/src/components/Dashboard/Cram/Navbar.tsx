import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const CramNavbar = (
	{ backUrl, currentIndex, count, skip, recap }: {
		backUrl: string
		currentIndex: number | null
		count: number | null
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
			{currentIndex === null
				? '...'
				: currentIndex + 1
			} / {count ?? '...'}
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
