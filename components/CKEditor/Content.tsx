import { useMemo, useCallback } from 'react'
import Base from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-memorize.ai'

export interface CKEditorProps {
	uploadUrl: string
	data: string
	setData: (data: string) => void
}

const CKEditor = ({ uploadUrl, data, setData }: CKEditorProps) => {
	const config = useMemo(
		() => ({
			simpleUpload: { uploadUrl }
		}),
		[uploadUrl]
	)

	const onChange = useCallback(
		(_event, editor) => {
			setData(editor.getData())
		},
		[setData]
	)

	return (
		<Base editor={Editor} data={data} config={config} onChange={onChange} />
	)
}

export default CKEditor
