import { PropsWithChildren } from 'react'
import cx from 'classnames'

import Sidebar, { SidebarProps } from './Sidebar'

import styles from 'styles/components/WithSidebar.module.scss'

export interface WithSidebarProps extends SidebarProps {
	className?: string
}

const WithSidebar = ({
	className,
	posts,
	children
}: PropsWithChildren<WithSidebarProps>) => (
	<div className={styles.root}>
		<Sidebar posts={posts} />
		<main className={cx(styles.body, className)}>
			{children}
		</main>
	</div>
)

export default WithSidebar
