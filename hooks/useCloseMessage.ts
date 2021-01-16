import { useEffect } from 'react'

const useCloseMessage = (message: string | null) => {
	useEffect(() => {
		if (!message) return

		const handler = (event: BeforeUnloadEvent) => {
			event.preventDefault()
			event.returnValue = message

			return message
		}

		window.addEventListener('beforeunload', handler)
		return () => window.removeEventListener('beforeunload', handler)
	}, [message])
}

export default useCloseMessage
