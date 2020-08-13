import { useMemo } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'
import PostHeader from 'components/PostHeader'
import PostBody from 'components/PostBody'

import styles from 'styles/pages/Post.module.scss'

const PostPage = ({ posts }: { posts: Post[] }) => {
	const { slug } = useRouter().query
	
	const post = useMemo(() => (
		posts.find(post => post.slug === slug)
	), [posts, slug])
	
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
