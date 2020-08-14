import Link from 'next/link'
import cx from 'classnames'

import Post from 'models/Post'

import styles from 'styles/components/Sidebar/PostRow.module.scss'

export interface SidebarPostRowProps {
	post: Post
	selected: boolean
}

const SidebarPostRow = ({ post, selected }: SidebarPostRowProps) => (
	<Link href="/p/[slug]" as={`/p/${post.slug}`}>
		<a className={cx(styles.root, { [styles.selected]: selected })}>
			<p className={styles.title}>
				{post.title}
			</p>
			<p className={styles.description}>
				{post.description}
			</p>
			<p className={styles.topics}>
				{post.topics.join(', ')}
			</p>
			<p className={styles.date}>
				{post.date}
			</p>
		</a>
	</Link>
)

export default SidebarPostRow
