import { useMemo, useCallback } from 'react'
import Base from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-memorize.ai'
import cx from 'classnames'

import styles from './index.module.scss'

export interface CKEditorProps {
	className?: string
	uploadUrl: string
	data: string
	setData(data: string): void
}

const CKEditor = ({ className, uploadUrl, data, setData }: CKEditorProps) => {
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
		<div className={cx(styles.root, className)}>
			<Base editor={Editor} data={data} config={config} onChange={onChange} />
		</div>
	)
}

export default CKEditor
