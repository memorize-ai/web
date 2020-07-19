import React, { memo } from 'react'
import { DiscussionEmbed } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

const DisqusDiscussionEmbedContent = (props: DisqusProps) => (
	<DiscussionEmbed {...componentProps(props)} />
)

export default memo(DisqusDiscussionEmbedContent)
