import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Slug {
	head: string
	tail?: number

	constructor(str: string) {
		const slug = str.trim().replace(/\s+/g, '-').replace(/\.+/g, '').toLowerCase()
		const parts = slug.match(/^(.+)\-(\d+)$/)
		this.head = (parts && parts[0]) || slug
		this.tail = parts && parts[1] ? parseInt(parts[1]) : undefined
	}

	static findAvailable(slug: Slug): Promise<Slug> {
		return firestore.collection('users').where('slug', '==', slug.toString()).get().then(users =>
			users.empty ? slug : Slug.findAvailable(slug.increment())
		)
	}

	toString(): string {
		return `${this.head}${this.tail ? `-${this.tail}` : ''}`
	}

	increment(): Slug {
		this.tail = (this.tail || 0) + 1
		return this
	}
}