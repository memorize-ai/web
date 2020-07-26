import React, { memo, useCallback, useState, FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import firebase from '../../../firebase'
import User from '../../../models/User'
import LoadingState from '../../../models/LoadingState'
import Modal from '.'
import Button from '../Button'
import { sleep, handleError } from '../../../utils'

import 'firebase/functions'

import '../../../scss/components/Modal/ContactUser.scss'

const functions = firebase.functions()
const contactUser = functions.httpsCallable('contactUser')

const ContactUserModal = (
	{ subjectPlaceholder, bodyPlaceholder, user, isShowing, setIsShowing }: {
		subjectPlaceholder: string
		bodyPlaceholder: string
		user: User | null
		isShowing: boolean
		setIsShowing: (isShowing: boolean) => void
	}
) => {
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = isLoading || !(user && body)
	
	const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault()
			
			if (isDisabled)
				return
			
			setLoadingState(LoadingState.Loading)
			setErrorMessage(null)
			
			await contactUser({ id: user!.id, subject, body })
			setLoadingState(LoadingState.Success)
			
			await sleep(500)
			setIsShowing(false)
		} catch (error) {
			handleError(error)
			
			setLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}, [isDisabled, user, subject, body, setLoadingState, setErrorMessage, setIsShowing])
	
	const onBodyRef = useCallback((element: HTMLTextAreaElement | null) => {
		element?.[isShowing ? 'focus' : 'blur']()
	}, [isShowing])
	
	return (
		<Modal
			className="contact-user"
			isLazy={true}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="top">
				<h2 className="title">
					Chat with {user?.name ?? '...'}
				</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<form onSubmit={onSubmit}>
				<label htmlFor="contact-user-modal-subject-input">
					Subject <span>(optional)</span>
				</label>
				<input
					id="contact-user-modal-subject-input"
					placeholder={subjectPlaceholder}
					value={subject}
					onChange={({ target: { value } }) => setSubject(value)}
				/>
				<label htmlFor="contact-user-modal-body-textarea">
					Message
				</label>
				<textarea
					id="contact-user-modal-body-textarea"
					ref={onBodyRef}
					placeholder={bodyPlaceholder}
					value={body}
					onChange={({ target: { value } }) => setBody(value)}
				/>
				<div className="footer">
					<Button
						className="submit-button"
						loaderSize="20px"
						loaderThickness="4px"
						loaderColor="white"
						loading={isLoading}
						disabled={isDisabled}
					>
						Send
					</Button>
					<p className="error-message">
						{errorMessage}
					</p>
				</div>
			</form>
		</Modal>
	)
}

export default memo(ContactUserModal)
