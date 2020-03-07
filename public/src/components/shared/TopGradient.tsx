import React, { HTMLAttributes } from 'react'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="top-gradient grid">
		<div className="background origin-top-right" />
		<div className="content z-10">{children}</div>
	</div>
)
