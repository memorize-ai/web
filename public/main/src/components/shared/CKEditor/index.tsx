import React, { lazy, Suspense } from 'react'

import Loader from './Loader'

import '../../../scss/components/CKEditor.scss'

export interface CKEditorProps {
	uploadUrl: string
	data: string
	setData: (data: string) => void
}

const Content = lazy(() => import('./Content'))

const CKEditor = (props: CKEditorProps) => (
	<Suspense fallback={<Loader />}>
		<Content {...props} />
	</Suspense>
)

export default CKEditor
