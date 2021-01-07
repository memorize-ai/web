import { memo, useCallback, useState, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import firebase from 'lib/firebase'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import Modal, { ModalShowingProps } from '.'
import Button from 'components/Button'
import { sleep } from 'lib/utils'

import 'firebase/functions'

const functions = firebase.functions()
const contactUser = functions.httpsCallable('contactUser')

const ContactUserModal = (
	{ subjectPlaceholder, bodyPlaceholder, user, isShowing, setIsShowing }: {
		subjectPlaceholder: string
		bodyPlaceholder: string
		user: User | null
	} & ModalShowingProps
) => {
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const [success, setSuccess] = useState(false)
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')
	
	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !(user && body)
	
	const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault()
			
			if (!user || isLoading || isDisabled)
				return
			
			setLoadingState(LoadingState.Loading)
			setErrorMessage(null)
			
			await contactUser({ id: user.id, subject, body })
			
			setLoadingState(LoadingState.Success)
			setSuccess(true)
			setSubject('')
			setBody('')
			
			await sleep(500)
			setIsShowing(false)
			
			await sleep(300)
			setSuccess(false)
			toast.success('Sent!')
		} catch (error) {
			console.error(error)
			
			setLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}, [isLoading, isDisabled, user, subject, body, setLoadingState, setSubject, setBody, setErrorMessage, setIsShowing])
	
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
						className={cx('submit-button', { success })}
						loaderSize="20px"
						loaderThickness="4px"
						loaderColor="white"
						loading={isLoading}
						disabled={isDisabled}
					>
						{success
							? <FontAwesomeIcon icon={faCheck} />
							: 'Send'
						}
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
