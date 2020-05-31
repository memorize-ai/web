import React, { lazy, Suspense, memo } from 'react'

import Policy from '../shared/Policy'

const Content = lazy(() => import('./Content'))

const Privacy = memo(() => (
	<Policy
		id="privacy"
		title="Privacy"
		description="Review memorize.ai's Privacy Policy to learn how your information is being used."
	>
		<Suspense fallback={null}>
			<Content />
		</Suspense>
	</Policy>
))

export default Privacy
