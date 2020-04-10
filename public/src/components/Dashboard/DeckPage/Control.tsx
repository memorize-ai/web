import React, { PropsWithChildren, ReactNode } from 'react'
import cx from 'classnames'

export default (
	{ title, className, children }: PropsWithChildren<{
		title: ReactNode
		className: string
	}>
) => (
	<div>
		<h2 className="title">{title}</h2>
		<div className={cx('box', className)}>
			{children}
		</div>
	</div>
)
