import User from 'models/User'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getQuery = (limit: number | null) => {
	const collection = firestore.collection('users')

	return limit === null
		? collection
		: collection.orderBy('xp', 'desc').limit(limit)
}

const getUsers = async (limit: number | null = null) =>
	(await getQuery(limit).get()).docs.map(snapshot =>
		User.dataFromSnapshot(snapshot)
	)

export default getUsers
