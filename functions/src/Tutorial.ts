import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Tutorial {
	static all(): Promise<TutorialSection[]> {
		return firestore.collection('tutorials').get().then(sections =>
			Promise.all(sections.docs.map(sectionDoc => {
				const section = new TutorialSection(sectionDoc.id, sectionDoc.get('name'), sectionDoc.get('default'))
				return section.loadPages().then(() => section)
			}))
		)
	}
}

export class TutorialSection {
	slug: string
	name: string
	defaultSlug: string
	pages: TutorialPage[]

	constructor(slug: string, name: string, defaultSlug: string, pages: TutorialPage[] = []) {
		this.slug = slug
		this.name = name
		this.defaultSlug = defaultSlug
		this.pages = pages
	}

	loadPages(): Promise<void> {
		return firestore.collection(`tutorials/${this.slug}/pages`).get().then(pages => {
			this.pages = pages.docs.map(page =>
				new TutorialPage(page.id, page.get('name'), page.get('html'))
			)
		})
	}
}

export class TutorialPage {
	slug: string
	name: string
	html: string

	constructor(slug: string, name: string, html: string) {
		this.slug = slug
		this.name = name
		this.html = html
	}
}