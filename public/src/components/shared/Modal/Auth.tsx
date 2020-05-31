import React, { useState, useCallback, useEffect, FormEvent, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import firebase from '../../../firebase'
import LoadingState from '../../../models/LoadingState'
import AuthenticationMode from '../../../models/AuthenticationMode'
import useAuthModal from '../../../hooks/useAuthModal'
import useCurrentUser from '../../../hooks/useCurrentUser'
import Modal from '.'
import Button from '../Button'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

import '../../../scss/components/Modal/Auth.scss'

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

const AuthModal = () => {
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const [[isShowing, setIsShowing], [callback, setCallback]] = useAuthModal()
	
	const [mode, setMode] = useState(AuthenticationMode.LogIn)
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const isSubmitButtonDisabled = !(
		(mode === AuthenticationMode.LogIn || name) &&
		email &&
		password
	)
	const isSubmitButtonLoading = loadingState === LoadingState.Loading
	
	const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		try {
			setLoadingState(LoadingState.Loading)
			setErrorMessage(null)
			
			switch (mode) {
				case AuthenticationMode.LogIn:
					analytics.logEvent('login', { method: 'email', component: 'Auth' })
					
					await auth.signInWithEmailAndPassword(email, password)
					break
				case AuthenticationMode.SignUp:
					analytics.logEvent('sign_up', { method: 'email', component: 'Auth' })
					
					const { user } = await auth.createUserWithEmailAndPassword(email, password)
					
					if (!user)
						throw new Error('An unknown error occurred. Please try again')
					
					await firestore.doc(`users/${user.uid}`).set({
						name,
						email,
						joined: firebase.firestore.FieldValue.serverTimestamp()
					})
					
					if (!callback)
						history.push('/interests')
					
					break
			}
			
			setLoadingState(LoadingState.Success)
		} catch (error) {
			setLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}, [mode, name, email, password, callback, history])
	
	const onNameRef = useCallback((input: HTMLInputElement | null) => {
		if (input && mode === AuthenticationMode.SignUp)
			input[isShowing ? 'focus' : 'blur']()
	}, [mode, isShowing])
	
	const onEmailRef = useCallback((input: HTMLInputElement | null) => {
		if (input && mode === AuthenticationMode.LogIn)
			input[isShowing ? 'focus' : 'blur']()
	}, [mode, isShowing])
	
	useEffect(() => {
		if (!(currentUser && isShowing))
			return
		
		setIsShowing(false)
		
		if (callback) {
			setCallback(null)
			callback(currentUser)
		}
	}, [currentUser, isShowing, callback, setCallback, setIsShowing])
	
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
						Sign up
					</button>
				</div>
			</div>
			<form onSubmit={onSubmit}>
				{mode === AuthenticationMode.SignUp && (
					<input
						ref={onNameRef}
						type="name"
						autoComplete="name"
						placeholder="Name"
						value={name}
						onChange={({ target: { value } }) => setName(value)}
					/>
				)}
				<input
					ref={onEmailRef}
					type="email"
					autoComplete="email"
					placeholder="Email"
					value={email}
					onChange={({ target: { value } }) => setEmail(value)}
				/>
				<input
					type="password"
					autoComplete={
						`${mode === AuthenticationMode.SignUp
							? 'new'
							: 'current'
						}-password`
					}
					placeholder="Password"
					value={password}
					onChange={({ target: { value } }) => setPassword(value)}
				/>
				<div className="footer">
					<Button
						type="submit"
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
							<a
								className="info"
								href="/#screenshots"
								onClick={() => setIsShowing(false)}
							>
								Why are we different?
							</a>
						)
					}
				</div>
			</form>
		</Modal>
	)
}

export default memo(AuthModal)
