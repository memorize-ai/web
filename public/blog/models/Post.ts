import User from './User'

export default interface Post {
	slug: string
	name: string
	date: string
	topics: string[]
	by: User
}
