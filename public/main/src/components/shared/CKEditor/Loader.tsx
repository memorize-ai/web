import React, { memo } from 'react'

import Loader from '../Loader'

const CKEditorLoader = () => (
	<div className="ck-editor-loader">
		<Loader size="24px" thickness="4px" color="#c4c4c4" />
	</div>
)

export default memo(CKEditorLoader)
