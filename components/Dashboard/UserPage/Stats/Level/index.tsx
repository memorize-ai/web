import cx from 'classnames'

import User from 'models/User'
import formatNumber, { formatNumberAsInt } from 'lib/formatNumber'

import styles from './index.module.scss'

export interface UserPageLevelProps {
	className?: string
	user: User
}

const UserPageLevel = ({ className, user }: UserPageLevelProps) => (
	<div className={cx(styles.root, className)}>
		<p className={styles.stats}>
			<span className={styles.level}>
				lvl {formatNumberAsInt(user.level ?? 0)}
			</span>{' '}
			<span className={styles.bullet}>&bull;</span>{' '}
			<span className={styles.xp}>{formatNumber(user.xp ?? 0)} xp</span>
		</p>
		<div className={styles.sliderContainer}>
			<div className={styles.slider}>
				<div
					className={styles.sliderContent}
					style={{ width: `${(user.percentToNextLevel ?? 0) * 100}%` }}
				/>
			</div>
			<p className={styles.sliderValue}>
				lvl {formatNumberAsInt((user.level ?? 0) + 1)}
			</p>
		</div>
	</div>
)

export default UserPageLevel
