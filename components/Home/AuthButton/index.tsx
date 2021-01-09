import cx from 'classnames'

import AuthButton from 'components/AuthButton'

import styles from './index.module.scss'

export interface AuthButtonProps {
	className?: string
}

const HomeAuthButton = ({ className }: AuthButtonProps) => (
	<AuthButton className={cx(styles.root, className)}>
		Log in <span className={styles.slash}>/</span> Sign up
	</AuthButton>
)

export default HomeAuthButton
