import React, { HTMLAttributes, memo } from 'react'

import '../../scss/components/ScrollIndicator.scss'

const ScrollIndicator = ({ color = 'white', ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div
		{...props}
		className="scroll-indicator"
		style={{ borderColor: color }}
	>
		<div style={{ background: color }} />
	</div>
)

export default memo(ScrollIndicator)
