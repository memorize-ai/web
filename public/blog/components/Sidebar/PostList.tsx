import Post from 'models/Post'
import PostRow from './PostRow'

import styles from 'styles/components/Sidebar/PostList.module.scss'

export interface SidebarPostListProps {
	posts: Post[]
	route: string
}

const SidebarPostList = ({ posts, route }: SidebarPostListProps) => (
	<div>
		<h2 className={styles.title}>
			Posts
		</h2>
		{posts.map(post => (
			<PostRow
				key={post.slug}
				post={post}
				selected={route === `/p/${post.slug}`}
			/>
		))}
	</div>
)

export default SidebarPostList
