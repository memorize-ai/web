import React, { PropsWithChildren } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'

import '../../scss/components/CreateCardPopUp/Container.scss'

export default ({ children }: PropsWithChildren<{}>) => (
	<div className="create-card-pop-up container">
		<TopGradient>
			<Navbar />
			<div className="container-content">
				{children}
			</div>
		</TopGradient>
	</div>
)
