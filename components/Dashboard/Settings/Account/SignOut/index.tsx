import { FormEvent } from 'react'

import firebase from 'lib/firebase'
import handleError from 'lib/handleError'

import styles from './index.module.scss'

import 'firebase/auth'

const auth = firebase.auth()

const signOut = async (event: FormEvent<HTMLFormElement>) => {
	event.preventDefault()

	try {
		await auth.signOut()
		window.location.href = '/'
	} catch (error) {
		handleError(error)
	}
}

const AccountSettingsSignOut = () => (
	<form className={styles.root} onSubmit={signOut}>
		<button className={styles.button}>Sign out</button>
	</form>
)

export default AccountSettingsSignOut
