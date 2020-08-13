import Link from 'next/link'

import Post from 'models/Post'
import PostBody from './PostBody'

import styles from 'styles/components/PostPreview.module.scss'

const PostPreview = ({ post }: { post: Post }) => (
	<Link href="/p/[slug]" as={`/p/${post.slug}`}>
		<a className={styles.root}>
			<h2 className={styles.title}>
				{post.title}
			</h2>
			<h3 className={styles.description}>
				{post.description}
			</h3>
			<p className={styles.by}>
				By {post.by.name} • {post.by.email}
			</p>
			<PostBody
				className={styles.body}
				allowLinks={false}
				post={post}
			/>
			<p className={styles.readMore}>
				Read more...
			</p>
		</a>
	</Link>
)

export default PostPreview
