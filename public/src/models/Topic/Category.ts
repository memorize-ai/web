enum Category {
	Language = 'language.jpg',
	Code = 'code.jpg',
	Science = 'science.jpg',
	Math = 'math.jpg',
	Art = 'art.jpg',
	Prep = 'prep.jpg',
	Politics = 'politics.jpg'
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
		return require(`../../images/topics/${name}.jpg`)
	} catch {
		return require(`../../images/topics/${category}`)
	}
}
