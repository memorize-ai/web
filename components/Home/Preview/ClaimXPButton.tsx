import { ButtonHTMLAttributes } from 'react'
import cx from 'classnames'

import useAuthModal from 'hooks/useAuthModal'
import AuthButton from 'components/AuthButton'

const PreviewClaimXPButton = ({
	inverted = false,
	className,
	...props
}: { inverted?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { initialXp } = useAuthModal()

	return (
		<AuthButton
			{...props}
			className={cx('preview-claim-xp-button', className, { inverted })}
			signUp
			goToAppStoreIfHandheldIos
		>
			{initialXp > 0 ? (
				<>
					Claim <span>{initialXp} xp</span>
				</>
			) : (
				'Start learning'
			)}
		</AuthButton>
	)
}

export default PreviewClaimXPButton
