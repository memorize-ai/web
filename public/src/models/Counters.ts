import { useContext } from 'react'

import firebase from '../firebase'
import CountersContext from '../contexts/Counters'
import { setCounterKey } from '../actions'

import 'firebase/firestore'

const firestore = firebase.firestore()

export enum Counter {
	Decks = 'decks'
}

export default class Counters {
	static get = (key: Counter) => {
		const [counters, dispatch] = useContext(CountersContext)
		const currentValue = counters[key]
		
		if (currentValue === null)
			firestore.doc(`counters/${key}`).get().then(snapshot =>
				dispatch(setCounterKey(key, snapshot.get('value') ?? 0))
			)
		
		return currentValue
	}
}
