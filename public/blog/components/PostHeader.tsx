import Post from 'models/Post'

import styles from 'styles/components/PostHeader.module.scss'

export interface PostHeaderProps {
	allowLinks?: boolean
	post: Post
}

const PostHeader = ({ allowLinks = true, post }: PostHeaderProps) => (
	<div className={styles.root}>
		<h1 className={styles.title}>
			{post.title}
		</h1>
		<h2 className={styles.description}>
			{post.description}
		</h2>
		<p className={styles.by}>
			By {post.by.name} • {
				allowLinks
					? (
						<a
							className={styles.email}
							rel="noopener noreferrer author"
							href={`mailto:${post.by.email}`}
							target="_blank"
						>
							{post.by.email}
						</a>
					)
					: post.by.email
			}
		</p>
		<p className={styles.topics}>
			{post.topics.join(', ')}
		</p>
		<p className={styles.date}>
			{post.date}
		</p>
	</div>
)

export default PostHeader
