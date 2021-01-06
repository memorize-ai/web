import { CommentCount } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

const DisqusCommentCount = (props: DisqusProps) => (
	<CommentCount {...componentProps(props)} />
)

export default DisqusCommentCount
