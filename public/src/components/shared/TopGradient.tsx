import React, { HTMLAttributes } from 'react'

import '../../styles/components/TopGradient.scss'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="top-gradient">
		<div className="background" />
		<div className="content">{children}</div>
	</div>
)
