import React, { PropsWithChildren } from 'react'

export default ({ children }: PropsWithChildren<{}>) => {
	return (
		<div>
			<h1>Dashboard</h1>
			{children}
		</div>
	)
}
