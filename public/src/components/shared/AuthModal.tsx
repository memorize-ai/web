import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import firebase from '../../firebase'
import LoadingState from '../../models/LoadingState'
import AuthenticationMode from '../../models/AuthenticationMode'
import useAuthModal from '../../hooks/useAuthModal'
import useCurrentUser from '../../hooks/useCurrentUser'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

import '../../scss/components/AuthModal.scss'

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

export default () => {
	const [currentUser] = useCurrentUser()
	const [[isShowing, setIsShowing], [callback, setCallback]] = useAuthModal()
	
	const [authenticationMode, setAuthenticationMode] = useState(AuthenticationMode.LogIn)
	const [authenticationLoadingState, setAuthenticationLoadingState] = useState(LoadingState.None)
	const [errorMessage, setErrorMessage] = useState(null as string | null)
	
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	
	const isAuthenticateButtonDisabled = !(
		(authenticationMode === AuthenticationMode.LogIn || name) &&
		email &&
		password
	)
	const isAuthenticateButtonLoading = authenticationLoadingState === LoadingState.Loading
	
	const authenticate = async () => {
		try {
			setAuthenticationLoadingState(LoadingState.Loading)
			setErrorMessage(null)
			
			switch (authenticationMode) {
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
					
					break
			}
			
			setAuthenticationLoadingState(LoadingState.Success)
		} catch (error) {
			setAuthenticationLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}
	
	useEffect(() => {
		console.log(currentUser, isShowing, callback)
		if (!(currentUser && isShowing))
			return
		
		setIsShowing(false)
		
		if (callback) {
			setCallback(null)
			callback(currentUser)
		}
	}, [currentUser, isShowing, callback, setIsShowing, setCallback])
	
	return (
		<Modal className="auth" isShowing={isShowing} setIsShowing={setIsShowing}>
			<div className="header">
				<h2 className="title">
					Change your life today, for free
				</h2>
				<button
					className="hide"
					onClick={() => setIsShowing(false)}
				>
					<FontAwesomeIcon icon={faTimesCircle} />
				</button>
			</div>
			<div className="content">
				<div className="toggle">
					<Button
						className={cx({
							selected: authenticationMode === AuthenticationMode.LogIn
						})}
						onClick={() => setAuthenticationMode(AuthenticationMode.LogIn)}
					>
						Log in
					</Button>
					<Button
						className={cx({
							selected: authenticationMode === AuthenticationMode.SignUp
						})}
						onClick={() => setAuthenticationMode(AuthenticationMode.SignUp)}
					>
						Sign up
					</Button>
				</div>
				<div className="inputs">
					{authenticationMode === AuthenticationMode.SignUp && (
						<Input
							icon={faUser}
							type="name"
							placeholder="Name"
							value={name}
							setValue={setName}
						/>
					)}
					<Input
						icon={faEnvelope}
						type="email"
						placeholder="Email"
						value={email}
						setValue={setEmail}
					/>
					<Input
						icon={faKey}
						type="password"
						placeholder="Password"
						value={password}
						setValue={setPassword}
					/>
				</div>
				<div className="footer">
					<Button
						loaderSize="16px"
						loaderThickness="3px"
						loaderColor="#63b3ed"
						loading={isAuthenticateButtonLoading}
						disabled={isAuthenticateButtonDisabled}
						onClick={authenticate}
					>
						Next
					</Button>
					<p hidden={!errorMessage}>
						{errorMessage}
					</p>
				</div>
			</div>
		</Modal>
	)
}
