import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

export default (
	{ href, isSelected, children }: {
		href: string
		isSelected: boolean
	} & HTMLAttributes<HTMLAnchorElement>
) => (
	<Link
		to={href}
		className={`px-8 py-2 text-dark-gray bg-${isSelected ? 'green-400' : 'red-400'}`}
	>
		{children}
	</Link>
)
