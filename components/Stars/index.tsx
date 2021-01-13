import cx from 'classnames'

import Star from './Star'

import styles from './index.module.scss'

const STARS = [0, 1, 2, 3, 4] as const

export interface StarsProps {
	className?: string
	children: number
}

const Stars = ({ className, children: rating }: StarsProps) => (
	<div className={cx(styles.root, className)}>
		{STARS.map(offset => (
			<Star
				key={offset}
				fill={Math.min(1, Math.max(0, rating - offset)) * 100}
			/>
		))}
	</div>
)

export default Stars
