import React from 'react'
import { CommentCount } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

export default (props: DisqusProps) => (
	<CommentCount {...componentProps(props)} />
)
