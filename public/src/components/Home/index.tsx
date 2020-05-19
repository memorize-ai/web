import React, { lazy, Suspense } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'

import '../../scss/components/Home/index.scss'

const LazyContent = lazy(() => import('./LazyContent'))

export default () => (
	<div className="home">
		<TopGradient>
			<Navbar />
			<Header />
			<Suspense fallback={null}>
				<LazyContent />
			</Suspense>
		</TopGradient>
	</div>
)
