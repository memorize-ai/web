import firebase from './firebase'

import 'firebase/messaging'

const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY
if (!vapidKey) throw new Error('Missing vapid key')

const TOKEN_OPTIONS = { vapidKey }
export const TOKEN_PERMISSION_BLOCKED_CODE = 'messaging/permission-blocked'

export class TokenError extends Error {
	constructor(public code: string, message?: string) {
		super(message)
	}
}

const getToken = async (): Promise<string | null> => {
	if (!firebase.messaging.isSupported()) return null
	const token = await firebase.messaging().getToken(TOKEN_OPTIONS)

	if (token) return token
	if (typeof Notification !== 'function') return null

	if ((await Notification.requestPermission()) !== 'granted')
		throw new TokenError(TOKEN_PERMISSION_BLOCKED_CODE, 'Permission denied')

	return getToken()
}

export default getToken
