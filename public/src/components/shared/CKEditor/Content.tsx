import React, { memo, useMemo, useCallback } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-memorize.ai'

import { CKEditorProps } from '.'

import '../../../types/ckeditor5-react.d'
import '../../../types/ckeditor5-memorize.ai.d'

const CKEditorContent = ({ uploadUrl, data, setData }: CKEditorProps) => {
	const config = useMemo(() => ({
		simpleUpload: { uploadUrl }
	}), [uploadUrl])
	
	const onChange = useCallback((_event: any, editor: any) => {
		setData(editor.getData())
	}, [setData])
	
	return (
		<CKEditor
			editor={Editor}
			data={data}
			config={config}
			onChange={onChange}
		/>
	)
}

export default memo(CKEditorContent)
