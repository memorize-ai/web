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

export const settingCreated = functions.firestore.document('users/{uid}/settings/{settingId}').onCreate(updateLastActivity)

export const settingUpdated = functions.firestore.document('users/{uid}/settings/{settingId}').onUpdate((change, context) =>
	firestore.doc(`settings/${context.params.settingId}`).get().then(setting =>
		Promise.all([
			change.after.get('value') === setting.get('default') ? change.after.ref.delete() : Promise.resolve(),
			updateLastActivity(change, context)
		])
	)
)

export const settingDeleted = functions.firestore.document('users/{uid}/settings/{settingId}').onDelete(updateLastActivity)

function updateLastActivity(_snapshot: any, context: functions.EventContext): Promise<any> {
	return User.updateLastActivity(context.params.uid)
}