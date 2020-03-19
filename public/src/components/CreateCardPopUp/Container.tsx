import React, { PropsWithChildren } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'

export default ({ children }: PropsWithChildren<{}>) => (
	<div className="min-h-screen bg-light-gray">
		<TopGradient>
			<Navbar />
			<div className="create-card-pop-up content-container mt-8">
				{children}
			</div>
		</TopGradient>
	</div>
)
