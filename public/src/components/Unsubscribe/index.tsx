import React, { lazy, Suspense, memo } from 'react'

const Content = lazy(() => import('./LazyContent'))

const Unsubscribe = memo(() => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
))

export default Unsubscribe
