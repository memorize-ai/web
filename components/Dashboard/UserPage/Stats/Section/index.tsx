import cx from 'classnames'

import styles from './index.module.scss'

export interface UserPageStatsSectionProps {
	className?: string
	name: string
	value: string
}

const UserPageStatsSection = ({
	className,
	name,
	value
}: UserPageStatsSectionProps) => (
	<div className={cx(styles.root, className)}>
		<p className={styles.value}>{value}</p>
		<p className={styles.name}>{name}</p>
	</div>
)

export default UserPageStatsSection
