import { useState, useCallback, ChangeEvent, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import Post from 'models/Post'
import normalize from 'lib/normalize'
import PostRow from './PostRow'

import logo from 'images/logos/capital.webp'
import logoFallback from 'images/logos/capital.jpg'

import styles from 'styles/components/Sidebar/index.module.scss'

export interface SidebarProps {
	posts: Post[]
}

const Sidebar = ({ posts }: SidebarProps) => {
	const { slug } = useRouter().query
	const [query, setQuery] = useState('')
	
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
					value={query}
					onChange={onQueryChange}
				/>
			</div>
			{filteredPosts.map(post => (
				<PostRow
					key={post.slug}
					post={post}
					selected={post.slug === slug}
				/>
			))}
		</aside>
	)
}

export default Sidebar
