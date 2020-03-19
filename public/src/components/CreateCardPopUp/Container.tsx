import React, { PropsWithChildren } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/BasicNavbar'

export default ({ children }: PropsWithChildren<{}>) => (
	<div className="create-card-pop-up-container min-h-screen bg-light-gray">
		<TopGradient>
			<Navbar />
			{children}
		</TopGradient>
	</div>
)
