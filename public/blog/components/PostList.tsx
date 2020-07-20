import Post from 'models/Post'

const PostList = ({ posts }: { posts: Post[] }) => (
	<ol>
		{posts.map(post => (
			<li key={post.slug}>
				{post.name}
			</li>
		))}
	</ol>
)

export default PostList
