export default interface CreateUserOptions {
	id: string
	name: string
	email: string
	method: 'email' | 'apple' | 'google'
	xp: number
}
