import { IdentificationData } from '.'

type HubSpotQueue = [string, IdentificationData][]

const getQueue = () =>
	(((window as unknown) as Record<string, unknown>)._hsq ||= []) as HubSpotQueue

const identifyWithHubSpot = (data: IdentificationData) => {
	getQueue().push(['identify', data])
}

export default identifyWithHubSpot
