import React, { memo, useCallback, useState } from 'react'

import firebase from '../../../firebase'
import User from '../../../models/User'
import LoadingState from '../../../models/LoadingState'
import Modal from '.'
import { sleep, handleError } from '../../../utils'

import 'firebase/functions'

const functions = firebase.functions()
const contactUser = functions.httpsCallable('contactUser')

const ContactUserModal = (
	{ user, isShowing, setIsShowing }: {
		user: User | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')
	
	const onSubmit = useCallback(async () => {
		try {
			if (!(user && body))
				return
			
			setLoadingState(LoadingState.Loading)
			await contactUser({ id: user.id, subject, body })
			setLoadingState(LoadingState.Success)
			
			await sleep(500)
			
			setIsShowing(false)
		} catch (error) {
			handleError(error)
			setLoadingState(LoadingState.Fail)
		}
	}, [user, subject, body, setLoadingState])
	
	return (
		<Modal
			className="contact-user"
			isLazy={true}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			{user?.name}
		</Modal>
	)
}

export default memo(ContactUserModal)
