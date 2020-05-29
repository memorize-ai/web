import React, { lazy, Suspense } from 'react'

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

export default (props: DisqusProps) => (
	<Suspense fallback={null}>
		<DiscussionEmbed {...props} />
	</Suspense>
)

export const DisqusCommentCount = (props: DisqusProps) => (
	<Suspense fallback={null}>
		<CommentCount {...props} />
	</Suspense>
)
