import React, { useState, useEffect } from 'react'
import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import firebase from '../../firebase'
import AuthenticationMode from '../../models/AuthenticationMode'
import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import Button from './Button'
import Input from './Input'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

import '../../scss/components/AuthBox.scss'

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

export interface AuthBoxProps {
	title: string
	onUser?: (user: firebase.User) => void
}

export default ({ title, onUser }: AuthBoxProps) => {
	const [currentUser] = useCurrentUser()
	
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
		currentUser && onUser && onUser(currentUser)
	}, [currentUser, onUser])
	
	return (
		<div className="auth-box">
			<h1 className="header">{title}</h1>
			<hr />
			<div className="authentication-mode-toggle">
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
	)
}
