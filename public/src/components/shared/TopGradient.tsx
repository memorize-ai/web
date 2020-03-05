import React, { PropsWithChildren } from 'react'

export default ({ children }: PropsWithChildren<{}>) => (
	<>
		<div className="top-gradient" />
		<div className="absolute inset-x-0 top-0">{children}</div>
	</>
)
