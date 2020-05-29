import React, { lazy, Suspense } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'

import '../../scss/components/404.scss'

const Content = lazy(() => import('./Content'))

export default () => (
	<div className="page-404">
		<TopGradient>
			<Navbar />
			<Suspense fallback={null}>
				<Content />
			</Suspense>
		</TopGradient>
	</div>
)
