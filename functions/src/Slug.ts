import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Slug {
	string: string
	parts: string[] | null

	hasParts = this.parts !== null

	constructor(str: string) {
		const slug = str.trim().replace(/\s+/g, '-').replace(/\.+/g, '').toLowerCase()
		this.string = slug
		this.parts = slug.match(/^(.+)\-(\d+)$/)
	}

	static assemble(slug: Slug): string {
		return slug.hasParts ? `${slug.parts![1]}-${parseInt(slug.parts![2]) + 1}` : `${slug}-1`
	}
	
	static next(slug: string): string {
		return Slug.assemble(new Slug(slug))
	}
	
	static find(str: string): Promise<string> {
		const slug = new Slug(str).string
		return firestore.collection('users').where('slug', '==', slug).get().then(snapshot => snapshot.empty ? slug : Slug.find(Slug.next(slug)))
	}
}