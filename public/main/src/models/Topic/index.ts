import { DeckSortAlgorithm } from '../Deck/Search'
import Category, { categoryFromString, imageUrlFromCategory, defaultCategory } from './Category'
import firebase from '../../firebase'
import { urlWithQuery, handleError } from '../../utils'

import 'firebase/firestore'

const firestore = firebase.firestore()

export default class Topic {
	static isObserving = false
	
	id: string
	name: string
	category: Category
	imageUrl: string
	
	constructor(id: string, name: string, category: string) {
		this.id = id
		this.name = name
		this.category = categoryFromString(category)
		this.imageUrl = imageUrlFromCategory(this.category, this.name)
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new Topic(
			snapshot.id,
			snapshot.get('name') ?? '(error)',
			snapshot.get('category') ?? defaultCategory
		)
	
	static observeAll = (
		{ addTopics, updateTopic, removeTopic }: {
			addTopics: (snapshots: firebase.firestore.DocumentSnapshot[]) => void
			updateTopic: (snapshot: firebase.firestore.DocumentSnapshot) => void
			removeTopic: (id: string) => void
		}
	) =>
		firestore.collection('topics').onSnapshot(
			snapshot => {
				const snapshots: firebase.firestore.DocumentSnapshot[] = []
				
				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							snapshots.push(doc)
							break
						case 'modified':
							updateTopic(doc)
							break
						case 'removed':
							removeTopic(doc.id)
							break
					}
				
				addTopics(snapshots)
			},
			handleError
		)
	
	static get schemaProps() {
		return {
			itemScope: true,
			itemType: 'https://schema.org/ItemList'
		}
	}
	
	get schemaProps() {
		return {
			itemProp: 'itemListElement',
			itemScope: true,
			itemType: 'https://schema.org/ListItem'
		}
	}
	
	positionSchemaProps = (index: number) => ({
		itemProp: 'position',
		content: (index + 1).toString()
	})
	
	get urlSchemaProps() {
		return {
			itemProp: 'url',
			content: `https://memorize.ai${this.marketUrl}`
		}
	}
	
	get imageSchemaProps() {
		return {
			hidden: true,
			itemProp: 'image',
			src: this.imageUrl,
			alt: this.name
		}
	}
	
	get nameSchemaProps() {
		return {
			itemProp: 'name'
		}
	}
	
	get marketUrl() {
		return urlWithQuery('/market', {
			q: this.name,
			s: DeckSortAlgorithm.Top
		})
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.category = categoryFromString(snapshot.get('category'))
		this.imageUrl = imageUrlFromCategory(this.category, this.name)
		
		return this
	}
}
