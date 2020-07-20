import { useRouter } from 'next/router'

import Post from 'models/Post'

import PostRow from './PostRow'

import styles from 'styles/components/PostList.module.scss'

export interface SidebarProps {
	posts: Post[]
}

const Sidebar = ({ posts }: SidebarProps) => {
	const { slug } = useRouter().query
	
	return (
		<aside className={styles.root}>
			
			{posts.map(post => (
				<PostRow key={post.slug} post={post} />
			))}
		</aside>
	)
}

export default Sidebar
