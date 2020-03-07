import React, { HTMLAttributes } from 'react'

export default ({ color, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="scroll-indicator" style={{ borderColor: color }}>
		<div style={{ background: color }} />
	</div>
)
