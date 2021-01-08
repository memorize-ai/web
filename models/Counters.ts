import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import state from 'state/counters'
import firebase from 'lib/firebase'

import 'firebase/firestore'

const firestore = firebase.firestore()

export enum Counter {
	Decks = 'decks'
}

export default class Counters {
	static get = (key: Counter) => {
		const [value, setValue] = useRecoilState(state(key))
		const didLoad = value !== null

		useEffect(() => {
			if (didLoad) return

			firestore
				.doc(`counters/${key}`)
				.get()
				.then(snapshot => setValue(snapshot.get('value') ?? 0))
		}, [key, didLoad, setValue])

		return value
	}
}
