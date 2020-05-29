import { lazy, Suspense } from 'react'

import styles from 'styles/components/CKEditor.module.scss'

export interface CKEditorProps {
	uploadUrl: string
	data: string
	setData: (data: string) => void
}

const CKEditor = process.browser ? lazy(() => import('@ckeditor/ckeditor5-react')) : null
const Editor = process.browser ? lazy(() => import('ckeditor5-memorize.ai')) : null

export default ({ uploadUrl, data, setData }: CKEditorProps) =>
	CKEditor && Editor
		? (
			<Suspense fallback={null}>
				<CKEditor
					editor={Editor}
					data={data}
					config={{
						simpleUpload: { uploadUrl }
					}}
					onChange={(_event: any, editor: any) =>
						setData(editor.getData())
					}
				/>
			</Suspense>
		)
		: null
