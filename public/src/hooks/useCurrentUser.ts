import { useState, useEffect } from 'react'

import firebase from '../firebase'

import 'firebase/auth'

const auth = firebase.auth()

export default (): [firebase.User | null, boolean] => {
	const [currentUser, setCurrentUser] = useState(null as firebase.User | null)
	const [didFinishLoading, setDidFinishLoading] = useState(false)
	
	useEffect(() => {
		auth.onAuthStateChanged(
			user => {
				setCurrentUser(user)
				setDidFinishLoading(true)
			},
			error => {
				alert('Oh no! An error occurred. Please reload the page to try again')
				console.error(error)
			}
		)
	}, [])
	
	return [currentUser, didFinishLoading]
}
