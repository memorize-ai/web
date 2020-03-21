import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

export default (
	{ outerClassName, anchor, children }: PropsWithChildren<{
		outerClassName?: string
		anchor: string
	}>
) => (
	<div className={cx('fixed-container', outerClassName)}>
		<div
			className="screenshot-container"
			data-aos="fade-right"
			data-aos-anchor={anchor}
			data-aos-anchor-placement="top-top"
		>
			{children}
		</div>
	</div>
)
