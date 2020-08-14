import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Post from 'models/Post'

import styles from 'styles/components/PostNavigation.module.scss'

export interface PostNavigationProps {
	className?: string
	previousPost: Post | undefined
	nextPost: Post | undefined
}

interface PostNavigationLinkProps {
	previous?: boolean
	post: Post
}

const PostNavigationLink = ({ previous = false, post }: PostNavigationLinkProps) => (
	<Link href="/p/[slug]" as={`/p/${post.slug}`}>
		<a className={styles.link}>
			{previous && (
				<FontAwesomeIcon
					className={cx(styles.icon, styles.iconLeft)}
					icon={faArrowLeft}
					height={20}
				/>
			)}
			<p className={styles.title}>
				{post.title}
			</p>
			{previous || (
				<FontAwesomeIcon
					className={cx(styles.icon, styles.iconRight)}
					icon={faArrowRight}
					height={20}
				/>
			)}
		</a>
	</Link>
)

const PostNavigation = ({ className, previousPost, nextPost }: PostNavigationProps) => (
	<nav className={cx(styles.root, className)}>
		{previousPost
			? <PostNavigationLink previous post={previousPost} />
			: <span />
		}
		{nextPost && <PostNavigationLink post={nextPost} />}
	</nav>
)

export default PostNavigation
