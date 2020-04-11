import React, { PropsWithChildren, ReactNode } from 'react'
import cx from 'classnames'

export default (
	{ id, title, className, children }: PropsWithChildren<{
		id: string
		title: ReactNode
		className: string
	}>
) => (
	<div id={id}>
		<h2 className="title">{title}</h2>
		<div className={cx('box', className)}>
			{children}
		</div>
	</div>
)
