import { GetStaticProps } from 'next'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'

import styles from 'styles/pages/index.module.scss'
import Head from 'next/head'

const Home = ({ posts }: { posts: Post[] }) => (
	<WithSidebar posts={posts} className={styles.root}>
		<Head>
			<meta
				key="description"
				name="description"
				content="memorize.ai blog"
			/>
			<title key="title">
				Blog | memorize.ai
			</title>
		</Head>
		<h1 className={styles.title}>
			memorize.ai blog
		</h1>
	</WithSidebar>
)

export const getStaticProps: GetStaticProps = async () => ({
	props: { posts: getPosts() }
})

export default Home
