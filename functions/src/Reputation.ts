import * as admin from 'firebase-admin'

const firestore = admin.firestore()

export default class Reputation {
	static getAmountForAction(action: ReputationAction): Promise<number> {
		return firestore.doc(`reputation/${action.valueOf()}`).get().then(doc => {
			const amount = doc.get('amount')
			return amount === undefined ? Promise.reject() : amount
		})
	}
}

export enum ReputationAction {
	join = 'join',
	rateDeck = 'rate-deck',
	rateDeckWithReview = 'rate-deck-with-review',
	everyFollower = 'every-follower',
	every10Followers = 'every-10-followers',
	every50Followers = 'every-50-followers',
	every100Followers = 'every-100-followers',
	everyCardReviewed = 'every-card-reviewed',
	every10CardsReviewed = 'every-10-cards-reviewed',
	every50CardsReviewed = 'every-50-cards-reviewed',
	every100CardsReviewed = 'every-100-cards-reviewed',
	didGetCardLike = 'did-get-card-like',
	didGetCardDislike = 'did-get-card-dislike',
	didGet1StarDeckRating = 'did-get-1-star-deck-rating',
	didGet2StarDeckRating = 'did-get-2-star-deck-rating',
	didGet4StarDeckRating = 'did-get-4-star-deck-rating',
	didGet5StarDeckRating = 'did-get-5-star-deck-rating'
}