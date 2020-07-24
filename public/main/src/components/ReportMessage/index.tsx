import React, { lazy, Suspense } from 'react'

const Content = lazy(() => import('./Content'))

const ReportMessage = () => (
	<Suspense fallback={null}>
		<Content />
	</Suspense>
)

export default ReportMessage
