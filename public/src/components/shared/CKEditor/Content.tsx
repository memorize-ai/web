import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-memorize.ai'

import { CKEditorProps } from '.'

import '../../../types/ckeditor5-react.d'
import '../../../types/ckeditor5-memorize.ai.d'

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
