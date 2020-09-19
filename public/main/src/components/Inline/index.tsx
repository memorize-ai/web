import React, { lazy, Suspense } from 'react'

import hideChat from '../../hooks/hideChat'

const Content = lazy(() => import('./Content'))

const Inline = () => {
	hideChat()
	
	return (
		<Suspense fallback={null}>
			<Content />
		</Suspense>
	)
}

export default Inline
