import { ButtonHTMLAttributes } from 'react'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import AuthButton from 'components/AuthButton'

import leftArrow from 'images/icons/left-arrow.svg'
import styles from './index.module.scss'

export type WhiteArrowAuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const WhiteArrowAuthButton = ({
	children,
	className,
	...props
}: WhiteArrowAuthButtonProps) => (
	<AuthButton
		{...props}
		className={cx(styles.root, className)}
		signUp
		goToAppStoreIfHandheldIos
	>
		<span className={styles.text}>{children}</span>
		<Svg className={styles.icon} src={leftArrow} />
	</AuthButton>
)

export default WhiteArrowAuthButton
