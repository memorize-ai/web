import { GetStaticProps } from 'next'
import Head from 'next/head'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'
import PostPreview from 'components/PostPreview'

import styles from 'styles/pages/index.module.scss'

const URL = 'https://blog.memorize.ai'
const TITLE = 'Blog | memorize.ai'
const DESCRIPTION = 'Browse articles written by the team behind memorize.ai, the ultimate memorization platform'

const Home = ({ posts }: { posts: Post[] }) => (
	<WithSidebar posts={posts} className={styles.root}>
		<Head>
			<link key="canonical" rel="canonical" href={URL} />
			<meta key="description" name="description" content={DESCRIPTION} />
			<meta key="meta-og-url" property="og:url" content={URL} />
			<meta key="meta-og-title" property="og:title" content={TITLE} />
			<meta key="meta-og-description" property="og:description" content={DESCRIPTION} />
			<meta key="meta-twitter-title" name="twitter:title" content={TITLE} />
			<meta key="meta-twitter-description" name="twitter:description" content={DESCRIPTION} />
			<title key="title">{TITLE}</title>
		</Head>
		<h1 className={styles.title}>
			memorize.ai blog
		</h1>
		<div className={styles.posts}>
			{posts.map(post => (
				<PostPreview key={post.slug} post={post} />
			))}
		</div>
	</WithSidebar>
)

export const getStaticProps: GetStaticProps = async () => ({
	props: { posts: getPosts() }
})

export default Home
