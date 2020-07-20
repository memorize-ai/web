import Link from 'next/link'

import Post from 'models/Post'

import styles from 'styles/components/PostRow.module.scss'

const PostRow = ({ post }: { post: Post }) => (
	<li>
		<Link href="/p/[slug]" as={`/p/${post.slug}`}>
			<a className={styles.link}>
				<h3 className={styles.name}>
					{post.name}
				</h3>
			</a>
		</Link>
	</li>
)

export default PostRow
