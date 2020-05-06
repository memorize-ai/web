enum Category {
	Language = 'language.webp',
	Code = 'code.webp',
	Science = 'science.webp',
	Math = 'math.webp',
	Art = 'art.webp',
	Prep = 'prep.webp',
	Politics = 'politics.webp'
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

export const imageUrlFromCategory = (category: Category, name: string) => {
	try {
		return require(`../../images/topics/${name}.webp`)
	} catch {
		return require(`../../images/topics/${category}`)
	}
}
