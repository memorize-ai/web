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
		<a className={cx(styles.root, {
			[styles.selected]: selected
		})}>
			<h3 className={styles.name}>
				{post.name}
			</h3>
			<p className={styles.date}>
				{post.date}
			</p>
		</a>
	</Link>
)

export default SidebarPostRow
