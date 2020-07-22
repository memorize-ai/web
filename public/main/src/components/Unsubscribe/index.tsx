import React, { lazy, Suspense } from 'react'

const Content = lazy(() => import('./Content'))

const Unsubscribe = () => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
)

export default Unsubscribe
