import Post from 'models/Post'

import PostRow from './PostRow'

import styles from 'styles/components/PostList.module.scss'

const PostList = ({ posts }: { posts: Post[] }) => (
	<ol className={styles.root}>
		{posts.map(post => (
			<PostRow key={post.slug} post={post} />
		))}
	</ol>
)

export default PostList
