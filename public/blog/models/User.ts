export default interface User {
	name: string
	email: string
}

export const USERS: Record<string, User> = {
	'ken-mueller': {
		name: 'Ken Mueller',
		email: 'ken@memorize.ai'
	},
	'claire-wang': {
		name: 'Claire Wang',
		email: 'claire@memorize.ai'
	}
}
