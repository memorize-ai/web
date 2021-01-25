import { useState, useCallback, useEffect, FormEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import cx from 'classnames'

import firebase from 'lib/firebase'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import AuthenticationMode from 'models/AuthenticationMode'
import useAuthModal from 'hooks/useAuthModal'
import useCurrentUser from 'hooks/useCurrentUser'
import useOnSignUp from 'hooks/useOnSignUp'
import Modal from '..'
import Button from 'components/Button'
import Providers from './Providers'
import { EMAIL_REGEX } from 'lib/constants'

import styles from './index.module.scss'

import 'firebase/auth'

const auth = firebase.auth()
auth.useDeviceLanguage()

const AuthModal = () => {
	const [currentUser] = useCurrentUser()
	const {
		isShowing,
		setIsShowing,
		callback,
		setCallback,
		mode,
		setMode,
		initialXp
	} = useAuthModal()

	const onSignUp = useOnSignUp()

	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [forgotPasswordLoadingState, setForgotPasswordLoadingState] = useState(
		LoadingState.None
	)
	const [errorMessage, setErrorMessage] = useState(null as string | null)

	const [isDisabled, setIsDisabled] = useState(false)

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const isSubmitButtonDisabled =
		isDisabled ||
		!((mode === AuthenticationMode.LogIn || name) && email && password)
	const isSubmitButtonLoading = loadingState === LoadingState.Loading

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			try {
				setIsDisabled(true)

				setLoadingState(LoadingState.Loading)
				setErrorMessage(null)

				switch (mode) {
					case AuthenticationMode.LogIn:
						await auth.signInWithEmailAndPassword(email, password)

						setIsDisabled(false)
						break
					case AuthenticationMode.SignUp: {
						const { user } = await auth.createUserWithEmailAndPassword(
							email,
							password
						)

						if (!user)
							throw new Error('An unknown error occurred. Please try again')

						await User.create({
							id: user.uid,
							name,
							email,
							method: 'email',
							xp: initialXp
						})

						user.updateProfile({ displayName: name })

						setIsDisabled(false)
						onSignUp()

						break
					}
				}

				setLoadingState(LoadingState.Success)
			} catch (error) {
				setIsDisabled(false)

				setLoadingState(LoadingState.Fail)
				setErrorMessage(error.message)
			}
		},
		[mode, name, email, password, callback, initialXp, onSignUp]
	)

	const onNameRef = useCallback(
		(input: HTMLInputElement | null) => {
			if (input && mode === AuthenticationMode.SignUp)
				input[isShowing ? 'focus' : 'blur']()
		},
		[mode, isShowing]
	)

	const onEmailRef = useCallback(
		(input: HTMLInputElement | null) => {
			if (input && mode === AuthenticationMode.LogIn)
				input[isShowing ? 'focus' : 'blur']()
		},
		[mode, isShowing]
	)

	const forgotPassword = useCallback(async () => {
		try {
			if (!email) throw new Error('Enter your email')

			if (!EMAIL_REGEX.test(email)) throw new Error('Invalid email')

			setForgotPasswordLoadingState(LoadingState.Loading)
			setErrorMessage(null)

			await auth.sendPasswordResetEmail(email)

			toast.success('Sent! Check your email')
			setForgotPasswordLoadingState(LoadingState.Success)
		} catch (error) {
			console.error(error)
			setForgotPasswordLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}, [email, setForgotPasswordLoadingState, setErrorMessage])

	useEffect(() => {
		if (!(currentUser && isShowing)) return

		setIsShowing(false)

		if (callback) {
			setCallback(null)
			callback(currentUser)
		}
	}, [currentUser, isShowing, callback, setCallback, setIsShowing])

	// Clear the error message when you change the state
	useEffect(() => {
		setErrorMessage(null)
	}, [name, email, password, mode, isShowing, setErrorMessage])

	return (
		<Modal
			className={styles.root}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className={styles.top}>
				<div className={styles.header}>
					<h2 className={styles.title}>Change your life today</h2>
					<button className={styles.hide} onClick={() => setIsShowing(false)}>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<div className={styles.tabs}>
					<button
						className={cx(styles.tab, {
							[styles.selectedTab]: mode === AuthenticationMode.LogIn
						})}
						onClick={() => setMode(AuthenticationMode.LogIn)}
					>
						Log in
					</button>
					<button
						className={cx(styles.tab, {
							[styles.selectedTab]: mode === AuthenticationMode.SignUp
						})}
						onClick={() => setMode(AuthenticationMode.SignUp)}
					>
						Sign up for free
					</button>
				</div>
			</div>
			<form className={styles.form} onSubmit={onSubmit}>
				{mode === AuthenticationMode.SignUp && (
					<>
						<label className={styles.label} htmlFor="auth-modal-name-input">
							Name
						</label>
						<input
							ref={onNameRef}
							id="auth-modal-name-input"
							className={styles.input}
							required
							type="name"
							autoComplete="name"
							placeholder="John Smith"
							value={name}
							onChange={({ target: { value } }) => setName(value)}
						/>
					</>
				)}
				<label className={styles.label} htmlFor="auth-modal-email-input">
					Email
				</label>
				<input
					ref={onEmailRef}
					id="auth-modal-email-input"
					className={styles.input}
					required
					type="email"
					autoComplete="email"
					placeholder="name@example.com"
					value={email}
					onChange={({ target: { value } }) => setEmail(value)}
				/>
				<div className={styles.label}>
					<label
						className={styles.innerLabel}
						htmlFor="auth-modal-password-input"
					>
						Password
					</label>
					{mode === AuthenticationMode.LogIn && (
						<Button
							type="button"
							className={styles.forgotPassword}
							loaderSize="20px"
							loaderThickness="4px"
							loaderColor="#5a2aff"
							loading={forgotPasswordLoadingState === LoadingState.Loading}
							disabled={false}
							onClick={forgotPassword}
							tabIndex={-1}
						>
							Forgot password?
						</Button>
					)}
				</div>
				<input
					id="auth-modal-password-input"
					className={styles.input}
					required
					type="password"
					autoComplete={`${
						mode === AuthenticationMode.SignUp ? 'new' : 'current'
					}-password`}
					placeholder="••••••"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
				/>
				<div className={styles.footer}>
					<Button
						className={styles.submit}
						loadingClassName={styles.submitLoading}
						disabledClassName={styles.submitDisabled}
						loaderSize="20px"
						loaderThickness="4px"
						loaderColor="white"
						loading={isSubmitButtonLoading}
						disabled={isSubmitButtonDisabled}
					>
						Next
					</Button>
					{errorMessage ? (
						<p className={styles.error}>{errorMessage}</p>
					) : (
						<Providers
							initialXp={initialXp}
							callback={callback}
							isDisabled={isDisabled}
							setIsDisabled={setIsDisabled}
							setErrorMessage={setErrorMessage}
						/>
					)}
				</div>
			</form>
		</Modal>
	)
}

export default AuthModal
