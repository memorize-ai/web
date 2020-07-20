const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
	window.location.hostname === '[::1]' ||
	window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

interface Config {
	onSuccess?: (registration: ServiceWorkerRegistration) => void
	onUpdate?: (registration: ServiceWorkerRegistration) => void
}

export const register = (config?: Config) => {
	if (!(process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator))
		return
	
	const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
	
	if (publicUrl.origin !== window.location.origin)
		return
	
	window.addEventListener('load', async () => {
		const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
		
		if (!isLocalhost)
			return registerValidSW(swUrl, config)
		
		await checkValidServiceWorker(swUrl, config)
		await navigator.serviceWorker.ready
		
		console.log('This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA')
	})
}

const registerValidSW = async (swUrl: string, config?: Config) => {
	try {
		const registration = await navigator.serviceWorker.register(swUrl)
		
		registration.onupdatefound = () => {
			const installingWorker = registration.installing
			
			if (installingWorker === null)
				return
			
			installingWorker.onstatechange = () => {
				if (installingWorker.state !== 'installed')
					return
				
				if (navigator.serviceWorker.controller) {
					console.log('New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.')
					
					if (config?.onUpdate)
						config.onUpdate(registration)
				} else {
					console.log('Content is cached for offline use.')
					
					if (config?.onSuccess)
						config.onSuccess(registration)
				}
			}
		}
	} catch (error) {
		console.error('Error during service worker registration:', error)
	}
}

const checkValidServiceWorker = async (swUrl: string, config?: Config) => {
	try {
		const response = await fetch(swUrl)
		const contentType = response.headers.get('content-type')
		
		if (!(response.status === 404 || (contentType !== null && contentType.indexOf('javascript') === -1)))
			return registerValidSW(swUrl, config)
		
		await (await navigator.serviceWorker.ready).unregister()
		window.location.reload()
	} catch {
		console.log('No internet connection found. App is running in offline mode.')
	}
}

export const unregister = async () =>
	'serviceWorker' in navigator
		? (await navigator.serviceWorker.ready).unregister()
		: null
