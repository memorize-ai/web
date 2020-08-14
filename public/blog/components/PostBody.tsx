import cx from 'classnames'

import Post from 'models/Post'
import CustomMDXProvider from './CustomMDXProvider'

import styles from 'styles/components/PostBody.module.scss'

export interface PostBodyProps {
	className?: string
	allowLinks?: boolean
	post: Post
}

const PostBody = ({ className, allowLinks = true, post }: PostBodyProps) => {
	const Body = require(`../posts/${post.slug}.mdx`).default
	
	return (
		<article className={cx(styles.root, className)}>
			<CustomMDXProvider allowLinks={allowLinks}>
				<Body />
			</CustomMDXProvider>
		</article>
	)
}

export default PostBody
