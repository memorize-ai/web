import { DiscussionEmbed } from 'disqus-react'

import { DisqusProps, componentProps } from '.'

const DisqusDiscussionEmbed = (props: DisqusProps) => (
	<DiscussionEmbed {...componentProps(props)} />
)

export default DisqusDiscussionEmbed
