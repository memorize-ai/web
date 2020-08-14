import { PropsWithChildren, useCallback, MouseEvent } from 'react'
import Link from 'next/link'
import { atom, useRecoilState } from 'recoil'
import cx from 'classnames'

import Sidebar, { SidebarProps } from './Sidebar'

import logo from 'images/logos/capital.webp'
import logoFallback from 'images/logos/capital.jpg'

import styles from 'styles/components/WithSidebar.module.scss'

const isSidebarShowingState = atom({
	key: 'isSidebarShowing',
	default: false
})

export interface WithSidebarProps extends SidebarProps {
	className?: string
}

const WithSidebar = ({
	className,
	posts,
	children
}: PropsWithChildren<WithSidebarProps>) => {
	const [isShowing, setIsShowing] = useRecoilState(isSidebarShowingState)
	
	const hide = useCallback(() => {
		setIsShowing(false)
	}, [setIsShowing])
	
	const show = useCallback((event: MouseEvent) => {
		event.stopPropagation()
		setIsShowing(true)
	}, [setIsShowing])
	
	return (
		<div className={styles.root}>
			<Sidebar
				className={cx(styles.sidebar, {
					[styles.sidebarShowing]: isShowing
				})}
				posts={posts}
				onRowClick={hide}
			/>
			<main
				className={cx(styles.body, className, {
					[styles.bodyDisabled]: isShowing
				})}
				onClick={hide}
			>
				<header className={styles.header}>
					<button className={styles.hamburgerMenu} onClick={show}>
						<span className={styles.hamburgerMenuRow} aria-hidden="true" />
						<span className={styles.hamburgerMenuRow} aria-hidden="true" />
						<span className={styles.hamburgerMenuRow} aria-hidden="true" />
					</button>
					<Link href="/">
						<a className={styles.logoContainer}>
							<picture>
								<source srcSet={logo} type="image/webp" />
								<img className={styles.logo} src={logoFallback} alt="Logo" />
							</picture>
						</a>
					</Link>
				</header>
				{children}
			</main>
		</div>
	)
}

export default WithSidebar
