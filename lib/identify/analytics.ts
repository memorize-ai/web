import { IdentificationData } from '.'
import firebase from 'lib/firebase'

import 'firebase/analytics'

const identifyWithAnalytics = ({ id, name, email }: IdentificationData) => {
	const analytics = firebase.analytics()

	analytics.setUserId(id)
	analytics.setUserProperties({ name, email })
}

export default identifyWithAnalytics
