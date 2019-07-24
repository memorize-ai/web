import * as admin from 'firebase-admin'

const messaging = admin.messaging()

export default class Notification {
	token: string
	title: string
	body: string

	constructor(token: string, title: string, body: string) {
		this.token = token
		this.title = title
		this.body = body
	}

	static send(notification: Notification): Promise<string> {
		return messaging.send(notification.toMessage())
	}

	static sendAll(notifications: Notification[]): Promise<admin.messaging.BatchResponse | null> {
		return notifications.length
			? messaging.sendAll(notifications.map(notification => notification.toMessage()))
			: Promise.resolve(null)
	}

	send(): Promise<string> {
		return Notification.send(this)
	}

	private toMessage(): admin.messaging.Message {
		return {
			notification: {
				title: this.title,
				body: this.body
			},
			token: this.token
		}
	}
}