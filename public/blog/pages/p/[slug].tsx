import { useMemo } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Post from 'models/Post'
import getPosts from 'lib/getPosts'
import WithSidebar from 'components/WithSidebar'

import styles from 'styles/pages/Post.module.scss'

const PostPage = ({ posts }: { posts: Post[] }) => {
	const { slug } = useRouter().query
	const { default: Body } = require(`posts/${slug}.mdx`)
	
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
					{post.name} | memorize.ai blog
				</title>
			</Head>
			<Body />
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
