import { ReactNode } from 'react'
import Link from 'next/link'
import { UrlObject } from 'url'
import cx from 'classnames'

import styles from './index.module.scss'

export interface DashboardNavbarTabProps {
	href: string | UrlObject
	title: string
	isSelected: boolean
	isDisabled: boolean
	message?: string
	children?: ReactNode
}

const DashboardNavbarTab = ({
	href,
	title,
	isSelected,
	isDisabled,
	message,
	children
}: DashboardNavbarTabProps) => (
	<Link href={href}>
		<a
			className={cx(styles.root, {
				[styles.selected]: isSelected,
				[styles.disabled]: isDisabled,
				[styles.hasOverlay]: message
			})}
			onClick={event => isDisabled && event.preventDefault()}
		>
			{message && (
				<span
					className={styles.overlay}
					aria-label={message}
					data-balloon-pos="left"
				/>
			)}
			{children}
			<span className={styles.title}>{title}</span>
		</a>
	</Link>
)

export default DashboardNavbarTab
