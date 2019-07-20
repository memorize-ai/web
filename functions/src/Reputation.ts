import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Reputation {
	static getAmountForAction(action: ReputationAction): Promise<number> {
		return firestore.doc(`reputation/${action.valueOf()}`).get().then(doc => {
			const amount = doc.get('amount')
			return amount === undefined ? Promise.reject() : amount
		})
	}

	static push(uid: string, action: ReputationAction, description: string, extras?: { uid: string } | { deckId: string }, reputation?: number): Promise<FirebaseFirestore.WriteResult> {
		return Reputation.getAmountForAction(action).then(amount =>
			Reputation.pushWithAmount(uid, amount, description, extras, reputation)
		)
	}

	static pushWithAmount(uid: string, amount: number, description: string, extras?: { uid: string } | { deckId: string }, reputation?: number): Promise<FirebaseFirestore.WriteResult> {
		const date = new Date
		const addDocument = (currentReputation: number) =>
			firestore.collection(`users/${uid}/reputationHistory`).add(Object.assign({
				date,
				amount,
				description,
				after: currentReputation + amount
			}, extras)).then(_documentReference =>
				firestore.doc(`users/${uid}`).update({ reputation: admin.firestore.FieldValue.increment(amount) })
			)
		return reputation === undefined
			? firestore.doc(`users/${uid}`).get().then(user =>
				addDocument(user.get('reputation'))
			)
			: addDocument(reputation)
	}
}

export enum ReputationAction {
	join = 'join',
	rateDeck = 'rate-deck',
	rateDeckWithReview = 'rate-deck-with-review',
	unrateDeck = 'unrate-deck',
	unrateDeckWithReview = 'unrate-deck-with-review',
	everyFollower = 'every-follower',
	every10Followers = 'every-10-followers',
	every50Followers = 'every-50-followers',
	every100Followers = 'every-100-followers',
	everyUnfollow = 'every-unfollow',
	everyCardReviewed = 'every-card-reviewed',
	didGetCardLike = 'did-get-card-like',
	didGetCardDislike = 'did-get-card-dislike',
	createDeck = 'create-deck',
	didGet1StarDeckRating = 'did-get-1-star-deck-rating',
	didGet2StarDeckRating = 'did-get-2-star-deck-rating',
	didGet4StarDeckRating = 'did-get-4-star-deck-rating',
	didGet5StarDeckRating = 'did-get-5-star-deck-rating',
	didGet1StarDeckRatingRemoved = 'did-get-1-star-deck-rating-removed',
	didGet2StarDeckRatingRemoved = 'did-get-2-star-deck-rating-removed',
	didGet4StarDeckRatingRemoved = 'did-get-4-star-deck-rating-removed',
	didGet5StarDeckRatingRemoved = 'did-get-5-star-deck-rating-removed'
}