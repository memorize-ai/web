import { useCallback, ChangeEvent, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { atom, useRecoilState } from 'recoil'
import Img from 'react-optimized-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Post from 'models/Post'
import normalize from 'lib/normalize'
import PostRow from './PostRow'
import logo from 'images/logo.jpg'

import styles from 'styles/components/Sidebar/index.module.scss'

const queryState = atom({
	key: 'query',
	default: ''
})

export interface SidebarProps {
	className?: string
	posts: Post[]
	onRowClick?(): void
}

const Sidebar = ({ className, posts, onRowClick }: SidebarProps) => {
	const { slug } = useRouter().query
	const [query, setQuery] = useRecoilState(queryState)
	
	const filteredPosts = useMemo(() => {
		const normalizedQuery = normalize(query)
		
		return posts.filter(post =>
			normalize(post.title).includes(normalizedQuery) ||
			normalize(post.description).includes(normalizedQuery) ||
			normalize(post.date).includes(normalizedQuery) ||
			post.topics.some(topic => normalize(topic).includes(normalizedQuery)) ||
			normalize(post.by.name).includes(normalizedQuery) ||
			normalize(post.by.email).includes(normalizedQuery) ||
			normalize(post.body).includes(normalizedQuery)
		)
	}, [posts, query])
	
	const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value)
	}, [setQuery])
	
	return (
		<aside className={cx(styles.root, className)}>
			<Link href="/">
				<a className={styles.logoContainer} onClick={onRowClick}>
					<Img className={styles.logo} src={logo} alt="Logo" webp />
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
					value={query}
					onChange={onQueryChange}
				/>
			</div>
			<div className={styles.posts}>
				{filteredPosts.map(post => (
					<PostRow
						key={post.slug}
						post={post}
						selected={post.slug === slug}
						onClick={onRowClick}
					/>
				))}
			</div>
		</aside>
	)
}

export default Sidebar
