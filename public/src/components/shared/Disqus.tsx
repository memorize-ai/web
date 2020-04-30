import React from 'react'
import { DiscussionEmbed, CommentCount } from 'disqus-react'

import { DISQUS_SHORTNAME } from '../../constants'

export interface DisqusProps {
	url: string
	id: string
	title: string
}

const configFromProps = ({ url, id, title }: DisqusProps) => ({
	url: url ?? window.location.href,
	identifier: id,
	title
})

const componentProps = (props: DisqusProps) => ({
	shortname: DISQUS_SHORTNAME,
	config: configFromProps(props)
})

export default (props: DisqusProps) => (
	<DiscussionEmbed {...componentProps(props)} />
)

export const DisqusCommentCount = (props: DisqusProps) => (
	<CommentCount {...componentProps(props)} />
)
