import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import Post from 'models/Post'
import PostRow from './PostRow'

import logo from 'images/logos/capital.webp'
import logoFallback from 'images/logos/capital.jpg'

import styles from 'styles/components/Sidebar/index.module.scss'

export interface SidebarProps {
	posts: Post[]
}

const Sidebar = ({ posts }: SidebarProps) => {
	const { route } = useRouter()
	
	return (
		<aside className={styles.root}>
			<Link href="/">
				<a className={styles.logoContainer}>
					<picture>
						<source srcSet={logo} type="image/webp" />
						<img className={styles.logo} src={logoFallback} alt="Logo" />
					</picture>
				</a>
			</Link>
			<div className={styles.divider} />
			<div className={styles.searchContainer}>
				<FontAwesomeIcon
					className={styles.searchIcon}
					icon={faSearch}
					height={16}
				/>
				<input
					className={styles.searchInput}
					placeholder="Posts"
				/>
			</div>
			{posts.map(post => (
				<PostRow
					key={post.slug}
					post={post}
					selected={route === `/p/${post.slug}`}
				/>
			))}
		</aside>
	)
}

export default Sidebar
