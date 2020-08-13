import User from './User'

export default interface Post {
	slug: string
	name: string
	description: string
	date: string
	topics: string[]
	by: User
	body: string
}
