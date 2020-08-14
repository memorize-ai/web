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

import styles from 'styles/pages/Post.module.scss'
import PostNavigation from 'components/PostNavigation'



const PostPage = ({ posts }: { posts: Post[] }) => {
	const { slug } = useRouter().query
	
	const post = useMemo(() => (
		posts.find(post => post.slug === slug)
	), [posts, slug])
	
	const indexOfPost = useMemo(() => (
		posts.indexOf(post)
	), [posts, post])
	
	const adjacentPosts = {
		previousPost: posts[indexOfPost - 1],
		nextPost: posts[indexOfPost + 1]
	}
	
	return (
		<WithSidebar posts={posts} className={styles.root}>
			<Head>
				<meta
					key="description"
					name="description"
					content={post.description}
				/>
				<title key="title">
					{post.title} | memorize.ai blog
				</title>
			</Head>
			<PostHeader post={post} />
			<PostBody post={post} />
			<PostNavigation
				className={styles.navigation}
				{...adjacentPosts}
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
