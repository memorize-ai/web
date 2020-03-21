import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import '../../scss/components/CreateCardPopUp/Box.scss'

export default (
	{ href, isSelected, children }: {
		href: string
		isSelected: boolean
	} & HTMLAttributes<HTMLAnchorElement>
) => (
	<Link
		to={href}
		className={cx(
			'create-card-pop-up',
			'box',
			{ selected: isSelected }
		)}
	>
		{children}
	</Link>
)
