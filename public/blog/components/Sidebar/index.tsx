import { useRouter } from 'next/router'

import Post from 'models/Post'
import HomeLink from './HomeLink'
import PostList from './PostList'

import styles from 'styles/components/Sidebar/index.module.scss'

export interface SidebarProps {
	posts: Post[]
}

const Sidebar = ({ posts }: SidebarProps) => {
	const { route } = useRouter()
	
	return (
		<aside className={styles.root}>
			<HomeLink selected={route === '/'} />
			<PostList posts={posts} route={route} />
		</aside>
	)
}

export default Sidebar
