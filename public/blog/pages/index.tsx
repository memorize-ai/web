import { GetStaticProps } from 'next'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'

import styles from 'styles/pages/index.module.scss'

const Home = ({ posts }: { posts: Post[] }) => (
	<WithSidebar posts={posts}>
		<h1 className={styles.title}>
			memorize.ai blog
		</h1>
	</WithSidebar>
)

export const getStaticProps: GetStaticProps = async () => ({
	props: { posts: await getPosts() }
})

export default Home
