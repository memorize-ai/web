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
	didGetCardLike = 'did-get-card-like',
	didGetCardDislike = 'did-get-card-dislike'
}