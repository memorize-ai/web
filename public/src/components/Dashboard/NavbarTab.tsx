import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

const DashboardNavbarTab = (
	{ href, title, isSelected, isDisabled, children }: PropsWithChildren<{
		href: string
		title: string
		isSelected: boolean
		isDisabled: boolean
	}>
) => (
	<Link
		to={href}
		className={cx('tab', {
			selected: isSelected,
			disabled: isDisabled
		})}
	>
		{children}
		<p>{title}</p>
	</Link>
)

export default DashboardNavbarTab
