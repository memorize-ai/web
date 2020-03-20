import React, { HTMLAttributes } from 'react'

import '../../scss/components/Loader.scss'

export default (
	{ size, thickness, color, ...props }: {
		size: string
		thickness: string
		color: string
	} & HTMLAttributes<HTMLDivElement>
) => (
	<div
		{...props}
		className="loader"
		style={{
			width: size,
			height: size,
			border: `${thickness} solid transparent`,
			borderTop: `${thickness} solid ${color}`,
			borderRight: `${thickness} solid ${color}`
		}}
	/>
)
