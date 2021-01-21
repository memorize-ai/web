import Cache from 'models/Cache'
import User from 'models/User'
import UserData from 'models/User/Data'
import firebase from 'lib/firebase/admin'

const firestore = firebase.firestore()

const userList = new Cache<number, UserData[]>(async limit => {
	const collection = firestore.collection('users')

	const query = limit
		? collection.orderBy('xp', 'desc').limit(limit)
		: collection

	return (await query.get()).docs.map(snapshot =>
		User.dataFromSnapshot(snapshot)
	)
})

export default userList
