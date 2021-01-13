import { HTMLAttributes } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
	size: string
	thickness: string
	color: string
}

const Loader = ({
	className,
	size,
	thickness,
	color,
	...props
}: LoaderProps) => (
	<span
		{...props}
		className={cx(styles.root, className)}
		style={{
			width: size,
			height: size,
			border: `${thickness} solid transparent`,
			borderTop: `${thickness} solid ${color}`,
			borderRight: `${thickness} solid ${color}`
		}}
	/>
)

export default Loader
