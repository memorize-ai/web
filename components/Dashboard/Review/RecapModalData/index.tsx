import { ReactNode } from 'react'

import styles from './index.module.scss'

export interface ReviewRecapModalDataProps {
	title: string
	children?: ReactNode
}

const ReviewRecapModalData = ({
	title,
	children
}: ReviewRecapModalDataProps) => (
	<div className={styles.root}>
		<p className={styles.title}>{title}</p>
		<p className={styles.content}>{children}</p>
	</div>
)

export default ReviewRecapModalData
