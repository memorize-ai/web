import React, { memo } from 'react'
import { DiscussionEmbed } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

const DisqusDiscussionEmbedContent = memo((props: DisqusProps) => (
	<DiscussionEmbed {...componentProps(props)} />
))

export default DisqusDiscussionEmbedContent
