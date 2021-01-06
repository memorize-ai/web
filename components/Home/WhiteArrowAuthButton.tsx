import { PropsWithChildren, ButtonHTMLAttributes } from 'react'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import AuthButton from 'components/AuthButton'

import leftArrow from 'images/icons/left-arrow.svg'

const WhiteArrowAuthButton = ({
	children,
	className,
	...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => (
	<AuthButton
		{...props}
		className={cx('white-arrow-auth-button', className)}
		signUp
		goToAppStoreIfHandheldIos
	>
		<span className="text">{children}</span>
		<Svg src={leftArrow} />
	</AuthButton>
)

export default WhiteArrowAuthButton
