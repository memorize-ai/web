enum Category {
	Language = 'language',
	Code = 'code',
	Science = 'science',
	Math = 'math',
	Art = 'art',
	Prep = 'prep',
	Politics = 'politics'
}

export default Category

export const defaultCategory = Category.Language

export const categoryFromString = (string: string) => {
	switch (string) {
		case 'language':
			return Category.Language
		case 'code':
			return Category.Code
		case 'science':
			return Category.Science
		case 'math':
			return Category.Math
		case 'art':
			return Category.Art
		case 'prep':
			return Category.Prep
		case 'politics':
			return Category.Politics
		default:
			return defaultCategory
	}
}

export const imageUrlFromCategory = (category: Category, name: string): string => {
	try {
		return require(`images/topics/${name}.jpg`).src // eslint-disable-line
	} catch {
		return require(`images/topics/${category}.jpg`).src // eslint-disable-line
	}
}
