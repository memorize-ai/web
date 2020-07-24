import React, { lazy, Suspense } from 'react'

const Content = lazy(() => import('./Content'))

const BlockUser = () => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
)

export default BlockUser
