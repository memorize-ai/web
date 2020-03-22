import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

export default (
	{ href, icon, title, isSelected }: {
		href: string
		icon: string
		title: string
		isSelected: boolean
	}
) => (
	<Link to={href} className={cx({ selected: isSelected })}>
		<img src={icon} alt={title} />
		<p>{title}</p>
	</Link>
)
