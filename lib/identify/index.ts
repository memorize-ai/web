import identifyWithAnalytics from './analytics'
import identifyWithHubSpot from './hubspot'

export interface IdentificationData {
	id: string
	name: string
	email: string
}

const identify = (data: IdentificationData) => {
	console.log('identify')
	identifyWithAnalytics(data)
	identifyWithHubSpot(data)
}

export default identify
