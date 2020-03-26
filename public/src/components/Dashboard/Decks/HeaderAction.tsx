import React from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default (
	{ color, icon, title, onClick }: {
		color?: string
		icon: IconDefinition
		title: string
		onClick: () => void
	}
) => (
	<button
		style={{ color }}
		onClick={onClick}
	>
		<FontAwesomeIcon icon={icon} />
		<p>{title}</p>
	</button>
)
