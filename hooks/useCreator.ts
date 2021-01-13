import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import User from 'models/User'
import state from 'state/creators'
import firebase from 'lib/firebase'
import handleError from 'lib/handleError'

import 'firebase/firestore'

const firestore = firebase.firestore()

const useCreator = (uid: string) => {
	const [creator, setCreator] = useRecoilState(state(uid))

	useEffect(() => {
		if (!uid || creator || User.creatorObservers[uid]) return

		User.creatorObservers[uid] = true

		firestore.doc(`users/${uid}`).onSnapshot(snapshot => {
			setCreator(snapshot.exists ? User.fromSnapshot(snapshot) : null)
		}, handleError)
	}, [uid, creator, setCreator])

	return creator
}

export default useCreator
