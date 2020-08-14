import { useMemo } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'
import PostHeader from 'components/PostHeader'
import PostBody from 'components/PostBody'
import PostNavigation from 'components/PostNavigation'

import styles from 'styles/pages/Post.module.scss'

const PostPage = ({ posts }: { posts: Post[] }) => {
	const { slug } = useRouter().query
	
	const post = useMemo(() => (
		posts.find(post => post.slug === slug)
	), [posts, slug])
	
	const indexOfPost = useMemo(() => (
		posts.indexOf(post)
	), [posts, post])
	
	const url = `https://blog.memorize.ai/p/${slug}`
	const title = `${post.title} | memorize.ai blog`
	const { description } = post
	
	return (
		<WithSidebar posts={posts} className={styles.root}>
			<Head>
				<link key="canonical" rel="canonical" href={url} />
				<meta key="description" name="description" content={description} />
				<meta key="meta-og-url" property="og:url" content={url} />
				<meta key="meta-og-title" property="og:title" content={title} />
				<meta key="meta-og-description" property="og:description" content={description} />
				<meta key="meta-twitter-title" name="twitter:title" content={title} />
				<meta key="meta-twitter-description" name="twitter:description" content={description} />
				<title key="title">{title}</title>
			</Head>
			<PostHeader post={post} />
			<PostBody post={post} />
			<PostNavigation
				className={styles.navigation}
				previousPost={posts[indexOfPost - 1]}
				nextPost={posts[indexOfPost + 1]}
			/>
		</WithSidebar>
	)
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: getPosts().map(({ slug }) => ({
		params: { slug }
	})),
	fallback: false
})

export const getStaticProps: GetStaticProps = async () => ({
	props: { posts: getPosts() }
})

export default PostPage
