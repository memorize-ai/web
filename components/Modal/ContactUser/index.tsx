import { useCallback, useState, FormEvent } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import firebase from 'lib/firebase'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import Modal, { ModalShowingProps } from '..'
import Button from 'components/Button'
import sleep from 'lib/sleep'

import styles from './index.module.scss'

import 'firebase/functions'

const functions = firebase.functions()
const contactUser = functions.httpsCallable('contactUser')

export interface ContactUserModalProps extends ModalShowingProps {
	subjectPlaceholder: string
	bodyPlaceholder: string
	user: User | null
}

const ContactUserModal = ({
	subjectPlaceholder,
	bodyPlaceholder,
	user,
	isShowing,
	setIsShowing
}: ContactUserModalProps) => {
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)

	const [success, setSuccess] = useState(false)
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')

	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !(user && body)

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			try {
				event.preventDefault()

				if (!user || isLoading || isDisabled) return

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
		},
		[
			isLoading,
			isDisabled,
			user,
			subject,
			body,
			setLoadingState,
			setSubject,
			setBody,
			setErrorMessage,
			setIsShowing
		]
	)

	const onBodyRef = useCallback(
		(element: HTMLTextAreaElement | null) => {
			element?.[isShowing ? 'focus' : 'blur']()
		},
		[isShowing]
	)

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.top}>
				<h2 className={styles.title}>Chat with {user?.name ?? '...'}</h2>
				<button className={styles.hide} onClick={() => setIsShowing(false)}>
					<FontAwesomeIcon icon={faTimes} />
				</button>
			</div>
			<form className={styles.form} onSubmit={onSubmit}>
				<label
					className={styles.label}
					htmlFor="contact-user-modal-subject-input"
				>
					Subject <span className={styles.labelInfo}>(optional)</span>
				</label>
				<input
					id="contact-user-modal-subject-input"
					className={styles.input}
					placeholder={subjectPlaceholder}
					value={subject}
					onChange={({ target: { value } }) => setSubject(value)}
				/>
				<label
					className={styles.label}
					htmlFor="contact-user-modal-body-textarea"
				>
					Message
				</label>
				<textarea
					id="contact-user-modal-body-textarea"
					className={styles.textArea}
					ref={onBodyRef}
					placeholder={bodyPlaceholder}
					value={body}
					onChange={({ target: { value } }) => setBody(value)}
				/>
				<div className={styles.footer}>
					<Button
						className={cx(styles.submit, { [styles.submitSuccess]: success })}
						loadingClassName={styles.submitLoading}
						disabledClassName={styles.submitDisabled}
						loaderSize="20px"
						loaderThickness="4px"
						loaderColor="white"
						loading={isLoading}
						disabled={isDisabled}
					>
						{success ? (
							<FontAwesomeIcon className={styles.submitIcon} icon={faCheck} />
						) : (
							'Send'
						)}
					</Button>
					<p className={styles.error}>{errorMessage}</p>
				</div>
			</form>
		</Modal>
	)
}

export default ContactUserModal
