import React from 'react'
import { DiscussionEmbed } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

export default (props: DisqusProps) => (
	<DiscussionEmbed {...componentProps(props)} />
)
