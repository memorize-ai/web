import React, { HTMLAttributes } from 'react'
import cx from 'classnames'

import '../../scss/components/Loader.scss'

export default (
	{ className, size, thickness, color, ...props }: {
		size: string
		thickness: string
		color: string
	} & HTMLAttributes<HTMLDivElement>
) => (
	<div
		{...props}
		className={cx('loader', className)}
		style={{
			width: size,
			height: size,
			border: `${thickness} solid transparent`,
			borderTop: `${thickness} solid ${color}`,
			borderRight: `${thickness} solid ${color}`
		}}
	/>
)
