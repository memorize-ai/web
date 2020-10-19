import { NextPage, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'

import styles from 'styles/pages/404.module.scss'

const TITLE = '404 | memorize.ai blog'
const DESCRIPTION = 'Oh no! You must be lost. There\'s nothing at this URL.'

export interface NotFoundProps {
	posts: Post[]
}

const NotFound: NextPage<NotFoundProps> = ({ posts }) => {
	const url = `https://blog.memorize.ai${useRouter().asPath}`
	
	return (
		<WithSidebar className={styles.root} posts={posts}>
			<Head>
				<link key="canonical" rel="canonical" href={url} />
				<meta key="description" name="description" content={DESCRIPTION} />
				<meta key="meta-og-url" property="og:url" content={url} />
				<meta key="meta-og-title" property="og:title" content={TITLE} />
				<meta key="meta-og-description" property="og:description" content={DESCRIPTION} />
				<meta key="meta-twitter-title" name="twitter:title" content={TITLE} />
				<meta key="meta-twitter-description" name="twitter:description" content={DESCRIPTION} />
				<title key="title">{TITLE}</title>
			</Head>
			<h1 className={styles.title}>
				Oh no! You must be lost. There's nothing at this URL.
			</h1>
		</WithSidebar>
	)
}

export const getStaticProps: GetStaticProps = async () => ({
	props: { posts: getPosts() }
})

export default NotFound
