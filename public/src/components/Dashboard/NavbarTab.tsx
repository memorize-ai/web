import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'

const DashboardNavbarTab = (
	{ href, title, isSelected, isDisabled, message, children }: PropsWithChildren<{
		href: string
		title: string
		isSelected: boolean
		isDisabled: boolean
		message?: string
	}>
) => (
	<Link
		to={href}
		className={cx('tab', {
			selected: isSelected,
			disabled: isDisabled
		})}
		onClick={event => isDisabled && event.preventDefault()}
	>
		<div
			className="overlay"
			aria-label={message}
			data-balloon-pos="right"
		/>
		{children}
		<p>{title}</p>
	</Link>
)

export default DashboardNavbarTab
