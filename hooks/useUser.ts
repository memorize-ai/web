import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'
import state from 'state/users'

import 'firebase/firestore'

const queue = new Set<string>()
const firestore = firebase.firestore()

const useUser = (id: string) => {
	const [user, setUser] = useRecoilState(state(id))

	useEffect(() => {
		if (queue.has(id)) return
		queue.add(id)

		firestore.doc(`users/${id}`).onSnapshot(snapshot => {
			setUser(User.fromSnapshot(snapshot))
		}, handleError)
	}, [id, setUser])

	return user
}

export default useUser
