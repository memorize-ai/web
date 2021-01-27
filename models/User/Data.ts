import UserNotifications from './Notifications'

export default interface UserData {
	id: string
	image: boolean | null
	slugId: string | null
	slug: string | null
	name: string | null
	email: string | null
	bio: string | null
	contact: boolean | null
	muted: boolean | null
	apiKey: string | null
	decks: number | null
	createdDecks: number | null
	xp: number | null
	interests: string[] | null
	allDecks: string[] | null
	notifications: UserNotifications | null
}
