import { GetStaticProps } from 'next'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import PostList from 'components/PostList'

import styles from 'styles/pages/index.module.scss'

const Home = ({ posts }: { posts: Post[] }) => (
	<div className={styles.root}>
		<h1 className={styles.title}>
			memorize.ai blog
		</h1>
		<PostList posts={posts} />
	</div>
)

export const getStaticProps: GetStaticProps = async () => ({
	props: { posts: await getPosts() }
})

export default Home
