import React from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-memorize.ai'

import '../../types/ckeditor5-react.d'
import '../../types/ckeditor5-memorize.ai.d'

export default (
	{ uploadUrl, data, setData }: {
		uploadUrl: string
		data: string
		setData: (data: string) => void
	}
) => (
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
