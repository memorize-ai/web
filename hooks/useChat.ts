import { useEffect } from 'react'

const hubspotUrl = process.env.NEXT_PUBLIC_HUBSPOT_URL
if (!hubspotUrl) throw new Error('Missing HubSpot URL')

const useChat = () => {
	useEffect(() => {
		const script = document.createElement('script')

		script.id = 'hs-script-loader'
		script.src = hubspotUrl
		script.async = true

		document.body.append(script)
	}, [])
}

export default useChat
