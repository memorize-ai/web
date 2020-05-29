import React, { PropsWithChildren } from 'react'
import Link from 'next/link'
import cx from 'classnames'

export default (
	{ href, as, title, isSelected, isDisabled, children }: PropsWithChildren<{
		href: string
		as?: string | { pathname: string, query: Record<string, any> }
		title: string
		isSelected: boolean
		isDisabled: boolean
	}>
) => (
	<Link href={href} as={as}>
		<a className={cx('tab', { selected: isSelected, disabled: isDisabled })}>
			{children}
			<p>{title}</p>
		</a>
	</Link>
)
