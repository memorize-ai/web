import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

export default (
	{ href, title, isSelected, children }: PropsWithChildren<{
		href: string
		title: string
		isSelected: boolean
	}>
) => (
	<Link to={href} className={cx('tab', { selected: isSelected })}>
		{children}
		<p>{title}</p>
	</Link>
)
