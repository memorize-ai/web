import * as admin from 'firebase-admin'

import User from './User'

const messaging = admin.messaging()

export default class Notification {
	token: string
	title: string
	body: string
	data?: NotificationData

	constructor(token: string, title: string, body: string, data?: NotificationData) {
		this.token = token
		this.title = title
		this.body = body
		this.data = data
	}

	static send(notification: Notification): Promise<string> {
		return messaging.send(notification.toMessage())
	}

	static sendAll(notifications: Notification[]): Promise<admin.messaging.BatchResponse | null> {
		return notifications.length
			? messaging.sendAll(notifications.map(notification => notification.toMessage()))
			: Promise.resolve(null)
	}

	static sendToUser(uid: string, notification: Notification): Promise<admin.messaging.BatchResponse | null> {
		return User.getTokens(uid).then(tokens =>
			Notification.sendAll(tokens.map(token =>
				new Notification(token, notification.title, notification.body, notification.data)
			))
		)
	}

	send(): Promise<string> {
		return Notification.send(this)
	}

	sendToUser(uid: string): Promise<admin.messaging.BatchResponse | null> {
		return Notification.sendToUser(uid, this)
	}

	setType(type: NotificationType): Notification {
		this.addData('type', type.valueOf())
		return this
	}

	addData(key: string, value: string): Notification {
		if (this.data)
			this.data[key] = value
		else
			this.data = { [key]: value }
		return this
	}

	private toMessage(): admin.messaging.Message {
		return {
			notification: {
				title: this.title,
				body: this.body
			},
			token: this.token,
			data: this.data
		}
	}
}

export type NotificationData = { [key: string]: string }

export enum NotificationType {
	cardsDue = 'cards-due',
	newFollower = 'new-follower',
	unfollowed = 'unfollowed',
	reputationMilestone = 'reputation-milestone'
}