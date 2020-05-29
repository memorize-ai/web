import React, { lazy, Suspense } from 'react'

import Loader from './Loader'

import '../../../styles/components/CKEditor.scss'

export interface CKEditorProps {
	uploadUrl: string
	data: string
	setData: (data: string) => void
}

const Content = lazy(() => import('./Content'))

export default (props: CKEditorProps) => (
	<Suspense fallback={<Loader />}>
		<Content {...props} />
	</Suspense>
)
