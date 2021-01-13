import User from 'models/User'
import identifyWithAnalytics from './analytics'
import identifyWithHubSpot from './hubspot'

export interface IdentificationData {
	id: string
	name: string
	email: string
}

const identifyFromData = (data: IdentificationData) => {
	identifyWithAnalytics(data)
	identifyWithHubSpot(data)
}

const identify = ({ id, name, email }: User) => {
	if (name && email) identifyFromData({ id, name, email })
}

export default identify
