import React, { lazy, Suspense } from 'react'

const Content = lazy(() => import('./Content'))

const RestrictContact = () => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
)

export default RestrictContact
