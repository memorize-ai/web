import React, { lazy, Suspense, memo } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'

import '../../scss/components/404.scss'

const Content = lazy(() => import('./Content'))

const PageNotFound = () => (
	<div className="page-404">
		<TopGradient>
			<Navbar />
			<Suspense fallback={null}>
				<Content />
			</Suspense>
		</TopGradient>
	</div>
)

export default memo(PageNotFound)
