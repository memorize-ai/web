import CKEditor from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-memorize.ai'

import '../../../scss/components/CKEditor.scss'

export interface CKEditorProps {
	uploadUrl: string
	data: string
	setData: (data: string) => void
}

export default ({ uploadUrl, data, setData }: CKEditorProps) => (
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
)
