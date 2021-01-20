import useCurrentUser from 'hooks/useCurrentUser'

import styles from './index.module.scss'

const AccountSettingsEmail = () => {
	const [currentUser] = useCurrentUser()
	const email = currentUser?.email

	return (
		<div className={styles.root}>
			<label className={styles.label}>Email</label>
			<p className={styles.text} aria-busy={!email}>
				{email ?? 'Loading...'}
			</p>
		</div>
	)
}

export default AccountSettingsEmail
