import { ReactNode } from 'react'

import styles from './index.module.scss'

export interface CramRecapModalDataProps {
	title: string
	children?: ReactNode
}

const CramRecapModalData = ({ title, children }: CramRecapModalDataProps) => (
	<div className={styles.root}>
		<p className={styles.title}>{title}</p>
		<p className={styles.content}>{children}</p>
	</div>
)

export default CramRecapModalData
