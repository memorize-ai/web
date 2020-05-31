import React, { lazy, Suspense, memo } from 'react'

import { DISQUS_SHORTNAME } from '../../../constants'

export interface DisqusProps {
	url: string
	id: string
	title: string
}

export const configFromProps = ({ url, id, title }: DisqusProps) => ({
	url,
	identifier: id,
	title
})

export const componentProps = (props: DisqusProps) => ({
	shortname: DISQUS_SHORTNAME,
	config: configFromProps(props)
})

const DiscussionEmbed = lazy(() => import('./DiscussionEmbed'))
const CommentCount = lazy(() => import('./CommentCount'))

const DisqusDiscussionEmbed = memo((props: DisqusProps) => (
	<Suspense fallback={null}>
		<DiscussionEmbed {...props} />
	</Suspense>
))

export default DisqusDiscussionEmbed

export const DisqusCommentCount = memo((props: DisqusProps) => (
	<Suspense fallback={null}>
		<CommentCount {...props} />
	</Suspense>
))
