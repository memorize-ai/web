/* eslint-disable no-undef */

class CustomPushEvent extends Event {
	constructor(event, data) {
		super('push')

		this.data = data
		this.waitUntil = event.waitUntil.bind(event)

		this.custom = true
	}
}

self.addEventListener('push', event => {
	if (event.custom) return

	event.stopImmediatePropagation()
	dispatchEvent(
		new CustomPushEvent(event, {
			json: () => {
				const newData = event.data.json()

				newData.data = {
					...newData.data,
					...newData.notification
				}

				delete newData.notification
				return newData
			}
		})
	)
})

self.addEventListener('notificationclick', event => {
	const { notification } = event

	notification.close()
	event.waitUntil(clients.openWindow(notification.data.url))
})

importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js')

firebase.initializeApp({
	apiKey: 'AIzaSyDfSkXDJ4kQCrRGfyauprPKPPoGZFEhySU',
	authDomain: 'memorize-ai.firebaseapp.com',
	databaseURL: 'https://memorize-ai.firebaseio.com',
	projectId: 'memorize-ai',
	storageBucket: 'memorize-ai.appspot.com',
	messagingSenderId: '629763488334',
	appId: '1:629763488334:web:9199305a713b3634',
	measurementId: 'G-N98QHH5MJ8'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(({ data: { title, body, icon, url } }) => {
	self.registration.showNotification(title, {
		body,
		icon,
		data: { url }
	})
})
