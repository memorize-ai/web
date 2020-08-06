import React, { useState, useCallback, useEffect, FormEvent, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import cx from 'classnames'

import firebase from '../../../../firebase'
import LoadingState from '../../../../models/LoadingState'
import AuthenticationMode from '../../../../models/AuthenticationMode'
import useAuthModal from '../../../../hooks/useAuthModal'
import useCurrentUser from '../../../../hooks/useCurrentUser'
import Modal from '..'
import Button from '../../Button'
import Providers from './Providers'
import { EMAIL_REGEX, IS_IOS_HANDHELD, APP_STORE_URL } from '../../../../constants'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

import '../../../../scss/components/Modal/Auth.scss'

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

auth.useDeviceLanguage()

const AuthModal = () => {
	const history = useHistory()
	
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
	
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [forgotPasswordLoadingState, setForgotPasswordLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const [isDisabled, setIsDisabled] = useState(false)
	
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const isSubmitButtonDisabled = isDisabled || !(
		(mode === AuthenticationMode.LogIn || name) &&
		email &&
		password
	)
	const isSubmitButtonLoading = loadingState === LoadingState.Loading
	
	const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		try {
			setIsDisabled(true)
			
			setLoadingState(LoadingState.Loading)
			setErrorMessage(null)
			
			switch (mode) {
				case AuthenticationMode.LogIn:
					analytics.logEvent('login', { method: 'email', component: 'Auth' })
					
					await auth.signInWithEmailAndPassword(email, password)
					
					setIsDisabled(false)
					break
				case AuthenticationMode.SignUp:
					analytics.logEvent('sign_up', { method: 'email', component: 'Auth' })
					
					const { user } = await auth.createUserWithEmailAndPassword(email, password)
					
					if (!user)
						throw new Error('An unknown error occurred. Please try again')
					
					await firestore.doc(`users/${user.uid}`).set({
						name,
						email,
						source: 'web',
						method: 'email',
						xp: initialXp,
						joined: firebase.firestore.FieldValue.serverTimestamp()
					})
					
					setIsDisabled(false)
					
					if (!callback)
						if (IS_IOS_HANDHELD)
							window.location.href = APP_STORE_URL
						else
							history.push('/interests')
					
					break
			}
			
			setLoadingState(LoadingState.Success)
		} catch (error) {
			setIsDisabled(false)
			
			setLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}, [mode, name, email, password, callback, initialXp, history])
	
	const onNameRef = useCallback((input: HTMLInputElement | null) => {
		if (input && mode === AuthenticationMode.SignUp)
			input[isShowing ? 'focus' : 'blur']()
	}, [mode, isShowing])
	
	const onEmailRef = useCallback((input: HTMLInputElement | null) => {
		if (input && mode === AuthenticationMode.LogIn)
			input[isShowing ? 'focus' : 'blur']()
	}, [mode, isShowing])
	
	const forgotPassword = useCallback(async () => {
		try {
			if (!email)
				throw new Error('Enter your email')
			
			if (!EMAIL_REGEX.test(email))
				throw new Error('Invalid email')
			
			analytics.logEvent('forgot-password', { email })
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
		if (!(currentUser && isShowing))
			return
		
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
			className="auth"
			isLazy={false}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="top">
				<div className="header">
					<h2 className="title">
						Change your life today
					</h2>
					<button
						className="hide"
						onClick={() => setIsShowing(false)}
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<div className="tabs">
					<button
						className={cx({ selected: mode === AuthenticationMode.LogIn })}
						onClick={() => setMode(AuthenticationMode.LogIn)}
					>
						Log in
					</button>
					<button
						className={cx({ selected: mode === AuthenticationMode.SignUp })}
						onClick={() => setMode(AuthenticationMode.SignUp)}
					>
						Sign up for free
					</button>
				</div>
			</div>
			<form onSubmit={onSubmit}>
				{mode === AuthenticationMode.SignUp && (
					<>
						<label className="header" htmlFor="auth-modal-name-input">
							Name
						</label>
						<input
							ref={onNameRef}
							id="auth-modal-name-input"
							required
							type="name"
							autoComplete="name"
							placeholder="John Smith"
							value={name}
							onChange={({ target: { value } }) => setName(value)}
						/>
					</>
				)}
				<label className="header" htmlFor="auth-modal-email-input">
					Email
				</label>
				<input
					ref={onEmailRef}
					id="auth-modal-email-input"
					required
					type="email"
					autoComplete="email"
					placeholder="name@example.com"
					value={email}
					onChange={({ target: { value } }) => setEmail(value)}
				/>
				<div className="header row">
					<label htmlFor="auth-modal-password-input">
						Password
					</label>
					{mode === AuthenticationMode.LogIn && (
						<Button
							type="button"
							className="forgot-password-button"
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
					required
					type="password"
					autoComplete={
						`${mode === AuthenticationMode.SignUp
							? 'new'
							: 'current'
						}-password`
					}
					placeholder="••••••"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
				/>
				<div className="footer">
					<Button
						className="submit-button"
						loaderSize="20px"
						loaderThickness="4px"
						loaderColor="white"
						loading={isSubmitButtonLoading}
						disabled={isSubmitButtonDisabled}
					>
						Next
					</Button>
					{errorMessage
						? (
							<p className="error-message">
								{errorMessage}
							</p>
						)
						: (
							<Providers
								initialXp={initialXp}
								callback={callback}
								isDisabled={isDisabled}
								setIsDisabled={setIsDisabled}
								setErrorMessage={setErrorMessage}
							/>
						)
					}
				</div>
			</form>
		</Modal>
	)
}

export default memo(AuthModal)
