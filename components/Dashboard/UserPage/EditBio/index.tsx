import { useState, useCallback, FormEvent } from 'react'

import User from 'models/User'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import useCloseMessage from 'hooks/useCloseMessage'
import Button from 'components/Button'
import CKEditor from 'components/CKEditor'

import styles from './index.module.scss'

import 'firebase/firestore'

const CONFIRM_CLOSE_MESSAGE =
	'Are you sure? You have unsaved changes that will be lost.'

const firestore = firebase.firestore()

export interface UserPageEditBioProps {
	user: User
}

const UserPageEditBio = ({ user }: UserPageEditBioProps) => {
	const originalBio = user.bio ?? ''

	const [bio, setBio] = useState(originalBio)
	const [isLoading, setIsLoading] = useState(false)

	const isDisabled = bio === originalBio
	useCloseMessage(isDisabled ? null : CONFIRM_CLOSE_MESSAGE)

	const save = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			if (isDisabled) return

			try {
				setIsLoading(true)
				await firestore.doc(`users/${user.id}`).update({ bio })
			} catch (error) {
				handleError(error)
			} finally {
				setIsLoading(false)
			}
		},
		[isDisabled, user.id, bio, setIsLoading]
	)

	return (
		<form id="about" className={styles.root} onSubmit={save}>
			<div className={styles.header}>
				<h2 className={styles.title}>About</h2>
				<Button
					className={styles.save}
					disabledClassName={styles.saveDisabled}
					loaderSize="20px"
					loaderThickness="4px"
					loaderColor="white"
					loading={isLoading}
					disabled={isDisabled}
				>
					Save
				</Button>
			</div>
			<CKEditor uploadUrl={user.uploadUrl} data={bio} setData={setBio} />
		</form>
	)
}

export default UserPageEditBio
