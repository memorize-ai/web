import { HTMLAttributes, ImgHTMLAttributes, MetaHTMLAttributes } from 'react'
import { UrlObject } from 'url'

import { DeckSortAlgorithm } from 'models/Deck/Search'
import Category, {
	categoryFromString,
	imageUrlFromCategory,
	defaultCategory
} from './Category'
import SnapshotLike from 'models/SnapshotLike'
import { BASE_URL } from 'lib/constants'

export interface TopicData {
	id: string
	name: string
	category: string
}

export default class Topic {
	static isObserving = false

	id: string
	name: string
	category: Category
	imageUrl: string

	constructor(data: TopicData) {
		this.id = data.id
		this.name = data.name
		this.category = categoryFromString(data.category)
		this.imageUrl = imageUrlFromCategory(this.category, this.name)
	}

	static fromSnapshot = (snapshot: SnapshotLike) =>
		new Topic(Topic.dataFromSnapshot(snapshot))

	static dataFromSnapshot = (snapshot: SnapshotLike): TopicData => ({
		id: snapshot.id,
		name: snapshot.get('name') ?? '(error)',
		category: snapshot.get('category') ?? defaultCategory
	})

	static get schemaProps() {
		return {
			itemScope: true,
			itemType: 'https://schema.org/ItemList'
		}
	}

	get schemaProps(): HTMLAttributes<HTMLElement> {
		return {
			itemProp: 'itemListElement',
			itemScope: true,
			itemType: 'https://schema.org/ListItem'
		}
	}

	positionSchemaProps = (
		index: number
	): MetaHTMLAttributes<HTMLMetaElement> => ({
		itemProp: 'position',
		content: (index + 1).toString()
	})

	get urlSchemaProps(): MetaHTMLAttributes<HTMLMetaElement> {
		return {
			itemProp: 'url',
			content: `${BASE_URL}${this.marketUrl}`
		}
	}

	get imageSchemaProps(): ImgHTMLAttributes<HTMLImageElement> {
		return {
			hidden: true,
			itemProp: 'image',
			src: this.imageUrl,
			alt: this.name,
			loading: 'lazy'
		}
	}

	get nameSchemaProps(): HTMLAttributes<HTMLElement> {
		return { itemProp: 'name' }
	}

	get marketUrl(): UrlObject {
		return {
			pathname: '/market',
			query: { q: this.name, s: DeckSortAlgorithm.Top }
		}
	}

	get backgroundImage() {
		return `url(${JSON.stringify(this.imageUrl)})`
	}
}
