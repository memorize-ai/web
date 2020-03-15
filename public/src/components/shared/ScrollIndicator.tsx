import React, { HTMLAttributes } from 'react'

export default ({ color = 'white', ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div
		{...props}
		className="scroll-indicator border-2 border-solid opacity-75"
		style={{ borderColor: color }}
	>
		<div className="mt-2 mx-auto" style={{ background: color }} />
	</div>
)
