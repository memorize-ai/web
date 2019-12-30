import { useState, useEffect } from 'react'

import firebase from '../firebase'
import LoadingState from '../LoadingState'

import 'firebase/auth'

const auth = firebase.auth()

export default (): [firebase.User | null, LoadingState] => {
	const [currentUser, setCurrentUser] = useState(null as firebase.User | null)
	const [loadingState, setLoadingState] = useState(LoadingState.None)
	
	useEffect(() => {
		auth.onAuthStateChanged(
			user => {
				setCurrentUser(user)
				setLoadingState(LoadingState.Success)
			},
			error => {
				alert('Oh no! An error occurred. Please reload the page to try again')
				console.error(error)
				setLoadingState(LoadingState.Fail)
			}
		)
	}, [])
	
	return [currentUser, loadingState]
}
