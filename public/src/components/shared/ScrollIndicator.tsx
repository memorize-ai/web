import React, { HTMLAttributes } from 'react'

import '../../scss/components/ScrollIndicator.scss'

export default ({ color = 'white', ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div
		{...props}
		className="scroll-indicator"
		style={{ borderColor: color }}
	>
		<div style={{ background: color }} />
	</div>
)
