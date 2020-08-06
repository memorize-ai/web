import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../../../../firebase'
import User from '../../../../models/User'
import LoadingState from '../../../../models/LoadingState'
import Button from '../../Button'
import { IS_IOS_HANDHELD, APP_STORE_URL } from '../../../../constants'

import { ReactComponent as AppleIcon } from '../../../../images/icons/apple.svg'
import { ReactComponent as GoogleIcon } from '../../../../images/icons/google.svg'

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'

const auth = firebase.auth()
const firestore = firebase.firestore()
const analytics = firebase.analytics()

const appleAuthProvider = new firebase.auth.OAuthProvider('apple.com')
appleAuthProvider.addScope('name')
appleAuthProvider.addScope('email')

const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.email')

const AuthModalProviders = (
	{ initialXp, callback, isDisabled, setIsDisabled, setErrorMessage }: {
		initialXp: number
		callback: ((user: User) => void) | null
		isDisabled: boolean
		setIsDisabled: (isDisabled: boolean) => void
		setErrorMessage: (message: string | null) => void
	}
) => {
	const history = useHistory()
	
	const [appleAuthLoadingState, setAppleAuthLoadingState] = useState(LoadingState.None)
	const [googleAuthLoadingState, setGoogleAuthLoadingState] = useState(LoadingState.None)
	
	const logIn = useCallback(async (
		method: 'apple' | 'google',
		setLoadingState: (loadingState: LoadingState) => void,
		provider: firebase.auth.OAuthProvider | firebase.auth.GoogleAuthProvider
	) => {
		try {
			analytics.logEvent('sign_up', { method, component: 'Auth' })
			
			setIsDisabled(true)
			
			setLoadingState(LoadingState.None)
			setErrorMessage(null)
			
			const {
				user,
				additionalUserInfo
			} = await auth.signInWithPopup(provider)
			
			if (!(user && additionalUserInfo))
				throw new Error('An unknown error occurred. Please try again')
			
			if (!user.email)
				throw new Error('Unable to get your email address')
			
			if (!additionalUserInfo.isNewUser)
				return
			
			setLoadingState(LoadingState.Loading)
			console.log(user, user.displayName, user.email, additionalUserInfo)
			await firestore.doc(`users/${user.uid}`).set({
				name: user.displayName ?? 'Anonymous',
				email: user.email,
				source: 'web',
				method,
				xp: initialXp,
				joined: firebase.firestore.FieldValue.serverTimestamp()
			})
			
			setIsDisabled(false)
		
			if (!callback)
				if (IS_IOS_HANDHELD)
					window.location.href = APP_STORE_URL
				else
					history.push('/interests')
			
			setLoadingState(LoadingState.Success)
		} catch (error) {
			setIsDisabled(false)
			
			if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
				setLoadingState(LoadingState.None)
				setErrorMessage(null)
				return
			}
			
			console.error(error)
			
			setLoadingState(LoadingState.Fail)
			setErrorMessage(error.message)
		}
	}, [setIsDisabled, setErrorMessage, initialXp, callback, history])
	
	const logInWithApple = useCallback(async () => {
		logIn('apple', setAppleAuthLoadingState, appleAuthProvider)
	}, [logIn, setAppleAuthLoadingState])
	
	const logInWithGoogle = useCallback(async () => {
		logIn('google', setGoogleAuthLoadingState, googleAuthProvider)
	}, [logIn, setGoogleAuthLoadingState])
	
	return (
		<div className="providers">
			<Button
				type="button"
				className="apple-auth-button"
				loaderSize="20px"
				loaderThickness="4px"
				loaderColor="white"
				loading={appleAuthLoadingState === LoadingState.Loading}
				disabled={isDisabled}
				onClick={logInWithApple}
			>
				<AppleIcon />
				<p>Log in</p>
			</Button>
			<Button
				type="button"
				className="google-auth-button"
				loaderSize="20px"
				loaderThickness="4px"
				loaderColor="white"
				loading={googleAuthLoadingState === LoadingState.Loading}
				disabled={isDisabled}
				onClick={logInWithGoogle}
			>
				<GoogleIcon />
				<p>Log in</p>
			</Button>
		</div>
	)
}

export default AuthModalProviders
