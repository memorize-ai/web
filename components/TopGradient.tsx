import { HTMLAttributes } from 'react'

const TopGradient = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="top-gradient">
		<div className="background" />
		<div className="content">{children}</div>
	</div>
)

export default TopGradient
