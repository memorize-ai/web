import { ButtonHTMLAttributes } from 'react'
import cx from 'classnames'

import useAuthModal from 'hooks/useAuthModal'
import AuthButton from 'components/AuthButton'

import styles from './index.module.scss'

export interface PreviewClaimXPButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	inverted?: boolean
}

const PreviewClaimXPButton = ({
	className,
	inverted = false,
	...props
}: PreviewClaimXPButtonProps) => {
	const { initialXp } = useAuthModal()

	return (
		<AuthButton
			{...props}
			className={cx(styles.root, className, {
				[styles.inverted]: inverted
			})}
			signUp
			goToAppStoreIfHandheldIos
		>
			{initialXp > 0 ? (
				<>
					Claim <span className={styles.xp}>{initialXp} xp</span>
				</>
			) : (
				'Start learning'
			)}
		</AuthButton>
	)
}

export default PreviewClaimXPButton
