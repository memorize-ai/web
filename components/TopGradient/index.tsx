import { HTMLAttributes } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

export type TopGradientProps = HTMLAttributes<HTMLDivElement>

const TopGradient = ({ className, children, ...props }: TopGradientProps) => (
	<div {...props} className={styles.root}>
		<div className={styles.background} />
		<div className={cx(styles.content, className)}>{children}</div>
	</div>
)

export default TopGradient
