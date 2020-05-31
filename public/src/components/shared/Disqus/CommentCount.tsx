import React, { memo } from 'react'
import { CommentCount } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

const DisqusCommentCountContent = memo((props: DisqusProps) => (
	<CommentCount {...componentProps(props)} />
))

export default DisqusCommentCountContent
