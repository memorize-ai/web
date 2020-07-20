import React, { HTMLAttributes, memo } from 'react'

import '../../scss/components/TopGradient.scss'

const TopGradient = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="top-gradient">
		<div className="background" />
		<div className="content">{children}</div>
	</div>
)

export default memo(TopGradient)
