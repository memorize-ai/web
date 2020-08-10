import React, { PropsWithChildren, ButtonHTMLAttributes } from 'react'
import cx from 'classnames'

import AuthButton from '../shared/AuthButton'

import { ReactComponent as LeftArrow } from '../../images/icons/left-arrow.svg'

import '../../scss/components/Home/WhiteArrowAuthButton.scss'

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
		<p>{children}</p>
		<LeftArrow />
	</AuthButton>
)

export default WhiteArrowAuthButton
