import React, { lazy, Suspense, memo } from 'react'

const Content = lazy(() => import('./LazyContent'))

const Unsubscribe = () => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
)

export default memo(Unsubscribe)
