import * as admin from 'firebase-admin'

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