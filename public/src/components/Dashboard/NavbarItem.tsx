import React from 'react'
import { Link } from 'react-router-dom'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cx from 'classnames'

export default (
	{ href, icon, title, isSelected }: {
		href: string
		icon: IconDefinition
		title: string
		isSelected: boolean
	}
) => (
	<Link to={href} className={cx({ selected: isSelected })}>
		<FontAwesomeIcon icon={icon} />
		<p>{title}</p>
	</Link>
)
