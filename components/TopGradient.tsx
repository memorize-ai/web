import { HTMLAttributes } from 'react'
import cx from 'classnames'

const TopGradient = ({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="top-gradient">
		<div className="background" />
		<div className={cx('content', className)}>{children}</div>
	</div>
)

export default TopGradient
