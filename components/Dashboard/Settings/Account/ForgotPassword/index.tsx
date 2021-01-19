import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import useCurrentUser from 'hooks/useCurrentUser'
import Loader from 'components/Loader'

import styles from './index.module.scss'

import 'firebase/auth'

const auth = firebase.auth()

const AccountSettingsName = () => {
	const [currentUser] = useCurrentUser()
	const [isLoading, setIsLoading] = useState(false)

	const email = currentUser?.email

	const send = useCallback(async () => {
		if (!email) return

		try {
			setIsLoading(true)
			await auth.sendPasswordResetEmail(email)

			toast.success('Sent password reset email')
		} catch (error) {
			handleError(error)
		} finally {
			setIsLoading(false)
		}
	}, [email, setIsLoading])

	return (
		<button
			className={styles.root}
			disabled={!email || isLoading}
			onClick={send}
		>
			{isLoading ? (
				<Loader size="16px" thickness="3px" color="#4355f9" />
			) : (
				'Forgot password'
			)}
		</button>
	)
}

export default AccountSettingsName
