import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import User from './User'

const firestore = admin.firestore()

export default class Setting {
	static get(setting: string, uid: string): Promise<any> {
		return firestore.collection('settings').where('slug', '==', setting).get().then(settings => {
			if (settings.empty)
				return undefined
			else {
				const defaultSetting = settings.docs[0]
				return firestore.doc(`users/${uid}/settings/${defaultSetting.id}`).get().then(userSetting =>
					userSetting.exists ? userSetting.get('value') : defaultSetting.get('default')
				)
			}
		})
	}
}

export const settingChanged = functions.firestore.document('users/{uid}/settings/{settingId}').onWrite((_change, context) =>
	User.updateLastActivity(context.params.uid)
)