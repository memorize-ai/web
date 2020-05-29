import React, { lazy, Suspense } from 'react'

const Content = lazy(() => import('./LazyContent'))

export default () => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
)
