import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { faUser, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'

import firebase from '../../firebase'
import AuthenticationMode from '../../models/AuthenticationMode'
import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Button from '../shared/Button'
import Input from '../shared/Input'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import '../../scss/components/Auth.scss'

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

export default () => {
	const history = useHistory()
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
		if (currentUser)
			history.push('/')
	}, [currentUser, history])
	
	return (
		<div className="min-h-screen bg-light-gray">
			<TopGradient>
				<Navbar />
				<div
					className="
						auth
						md:w-2/3
						lg:w-1/2
						mt-10
						mx-auto
						px-6
						pt-4
						pb-4
						bg-white
						rounded-lg
						shadow-lg
					"
				>
					<h1 className="header text-2xl sm:text-4xl text-dark-gray font-bold">
						Welcome to memorize.ai!
					</h1>
					<hr className="mt-4 mb-4" />
					<div className="flex mb-4">
						<Button
							className={`
								w-full
								h-8
								mr-2
								px-8
								text-${
									authenticationMode === AuthenticationMode.LogIn
										? 'white'
										: 'blue-400'
								}
								hover:text-white
								font-bold
								border-2
								border-blue-400
								${authenticationMode === AuthenticationMode.LogIn ? 'bg-blue-400' : ''}
								hover:bg-blue-400
								rounded
							`}
							onClick={() => setAuthenticationMode(AuthenticationMode.LogIn)}
						>
							Log in
						</Button>
						<Button
							className={`
								w-full
								h-8
								px-8
								text-${
									authenticationMode === AuthenticationMode.SignUp
										? 'white'
										: 'blue-400'
								}
								hover:text-white
								font-bold
								border-2
								border-blue-400
								${authenticationMode === AuthenticationMode.SignUp ? 'bg-blue-400' : ''}
								hover:bg-blue-400
								rounded
							`}
							onClick={() => setAuthenticationMode(AuthenticationMode.SignUp)}
						>
							Sign up
						</Button>
					</div>
					<div>
						{authenticationMode === AuthenticationMode.SignUp && (
							<Input
								className="mb-2"
								icon={faUser}
								type="name"
								placeholder="Name"
								value={name}
								setValue={setName}
							/>
						)}
						<Input
							className="mb-2"
							icon={faEnvelope}
							type="email"
							placeholder="Email"
							value={email}
							setValue={setEmail}
						/>
						<Input
							className="mb-4"
							icon={faKey}
							type="password"
							placeholder="Password"
							value={password}
							setValue={setPassword}
						/>
					</div>
					<div className="flex items-center">
						<Button
							className={`
								h-8
								mr-auto
								px-8
								text-blue-${isAuthenticateButtonDisabled ? 200 : 400}
								${isAuthenticateButtonDisabled || isAuthenticateButtonLoading ? '' : 'hover:text-white'}
								font-bold
								border-2
								border-blue-${isAuthenticateButtonDisabled ? 200 : 400}
								${isAuthenticateButtonDisabled || isAuthenticateButtonLoading ? '' : 'hover:bg-blue-400'}
								rounded
							`}
							loaderSize="16px"
							loaderThickness="3px"
							loaderColor="#63b3ed"
							loading={isAuthenticateButtonLoading}
							disabled={isAuthenticateButtonDisabled}
							onClick={authenticate}
						>
							Next
						</Button>
						<p className="ml-6 text-red-600 font-bold" hidden={!errorMessage}>
							{errorMessage}
						</p>
					</div>
				</div>
			</TopGradient>
		</div>
	)
}
