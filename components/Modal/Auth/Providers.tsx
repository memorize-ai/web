import { useCallback, useState } from 'react'
import Router from 'next/router'
import { Svg } from 'react-optimized-image'

import firebase from 'lib/firebase'
import User from 'models/User'
import LoadingState from 'models/LoadingState'
import Button from 'components/Button'
import { APP_STORE_URL } from 'lib/constants'
import { isIosHandheld } from 'lib/utils'

import apple from 'images/icons/apple.svg'
import google from 'images/icons/google.svg'

import 'firebase/auth'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

const appleAuthProvider = new firebase.auth.OAuthProvider('apple.com')
appleAuthProvider.addScope('name')
appleAuthProvider.addScope('email')

const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
googleAuthProvider.addScope('https://www.googleapis.com/auth/userinfo.email')

const AuthModalProviders = ({
	initialXp,
	callback,
	isDisabled,
	setIsDisabled,
	setErrorMessage
}: {
	initialXp: number
	callback: ((user: User) => void) | null
	isDisabled: boolean
	setIsDisabled: (isDisabled: boolean) => void
	setErrorMessage: (message: string | null) => void
}) => {
	const [appleAuthLoadingState, setAppleAuthLoadingState] = useState(
		LoadingState.None
	)
	const [googleAuthLoadingState, setGoogleAuthLoadingState] = useState(
		LoadingState.None
	)

	const logIn = useCallback(
		async (
			method: 'apple' | 'google',
			setLoadingState: (loadingState: LoadingState) => void,
			provider: firebase.auth.OAuthProvider | firebase.auth.GoogleAuthProvider
		) => {
			try {
				setIsDisabled(true)

				setLoadingState(LoadingState.None)
				setErrorMessage(null)

				const { user, additionalUserInfo } = await auth.signInWithPopup(
					provider
				)

				if (!(user && additionalUserInfo))
					throw new Error('An unknown error occurred. Please try again')

				if (!user.email) throw new Error('Unable to get your email address')

				if (!additionalUserInfo.isNewUser) return

				setLoadingState(LoadingState.Loading)

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
					if (isIosHandheld()) window.location.href = APP_STORE_URL
					else Router.push('/interests')

				setLoadingState(LoadingState.Success)
			} catch (error) {
				setIsDisabled(false)

				if (
					error.code === 'auth/popup-closed-by-user' ||
					error.code === 'auth/cancelled-popup-request'
				) {
					setLoadingState(LoadingState.None)
					setErrorMessage(null)
					return
				}

				console.error(error)

				setLoadingState(LoadingState.Fail)
				setErrorMessage(error.message)
			}
		},
		[setIsDisabled, setErrorMessage, initialXp, callback]
	)

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
				<Svg src={apple} />
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
				<Svg src={google} />
				<p>Log in</p>
			</Button>
		</div>
	)
}

export default AuthModalProviders
