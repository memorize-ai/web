import firebase from './firebase'

import 'firebase/messaging'

const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY
if (!vapidKey) throw new Error('Missing vapid key')

const getToken = async (): Promise<string | null> => {
	const token = await firebase.messaging().getToken({ vapidKey })

	if (token) return token
	if (typeof Notification !== 'function') return null

	if ((await Notification.requestPermission()) !== 'granted')
		throw new Error('Permission denied')

	return getToken()
}

export default getToken
