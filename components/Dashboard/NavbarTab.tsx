import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { UrlObject } from 'url'
import cx from 'classnames'

const DashboardNavbarTab = ({
	href,
	title,
	isSelected,
	isDisabled,
	message,
	children
}: PropsWithChildren<{
	href: string | UrlObject
	title: string
	isSelected: boolean
	isDisabled: boolean
	message?: string
}>) => (
	<Link href={href}>
		<a
			className={cx('tab', {
				selected: isSelected,
				disabled: isDisabled,
				'has-overlay': message
			})}
			onClick={event => isDisabled && event.preventDefault()}
		>
			{message && (
				<span
					className="overlay"
					aria-label={message}
					data-balloon-pos="left"
				/>
			)}
			{children}
			<span>{title}</span>
		</a>
	</Link>
)

export default DashboardNavbarTab