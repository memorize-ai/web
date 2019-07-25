import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as secure from 'securejs'

import Deck from './Deck'
import Card from './Card'
import Permission, { PermissionRole } from './Permission'

const firestore = admin.firestore()
const auth = admin.auth()

type NewDeckData = { name: string, subtitle: string, public: boolean }
type DeckData = FirebaseFirestore.DocumentData & { image: string, userData: FirebaseFirestore.DocumentData }

export const getUserSignInToken = functions.https.onRequest((req, res) => {
	const password: string | undefined = req.query.password
	const email: string | undefined = req.query.email
	const uid: string | undefined = req.query.uid
	return (email || uid) && password
		? (email ? auth.getUserByEmail(email) : auth.getUser(uid || '')).then(user =>
			checkPasswordForUser(user, password)
				? sendNewSignInToken(user.uid, res)
				: res.send(401).send('Invalid password')
		).catch(_error =>
			res.send(403).send(`Invalid ${email ? 'email' : 'uid'}`)
		)
		: res.status(400).send('Specify a uid or email and password')
})

export const checkUserSignInToken = functions.https.onRequest((req, res) => {
	const uid: string | undefined = req.query.uid
	const token: string | undefined = req.query.token
	return uid && token
		? checkSignInToken(uid, token).then(valid =>
			valid
				? firestore.doc(`users/${uid}`).get().then(user =>
					res.status(200).send(user.data())
				)
				: res.status(404).send('Invalid token')
		)
		: res.status(400).send('Specify a uid and token')
})

export const getUserDecks = functions.https.onRequest((req, res) => {
	const uid: string | undefined = req.query.uid
	const token: string | undefined = req.query.token
	return uid && token
		? checkSignInToken(uid, token).then(valid =>
			valid
				? firestore.collection(`users/${uid}/decks`).where('hidden', '==', false).get().then(userDecks =>
					Promise.all(userDecks.docs.map(userDeck =>
						firestore.doc(`decks/${userDeck.id}`).get().then(deck =>
							Deck.image(deck).then(image =>
								Object.assign(deck.data() || {}, { image, userData: userDeck.data() }) as DeckData
							)
						)
					)).then(decks =>
						res.status(200).send(decks)
					)
				)
				: res.status(404).send('Invalid token')
		)
		: res.status(400).send('Specify a uid and token')
})

export const createCardWithSignInToken = functions.https.onRequest((req, res) => {
	const now = new Date
	const uid: string | undefined = req.query.uid
	const token: string | undefined = req.query.token
	const deckId: string | undefined = req.query.deck
	const newDeck: NewDeckData | undefined = req.query.newDeck
	const front: string | undefined = req.query.front
	const back: string | undefined = req.query.back
	return uid && token && (deckId || newDeck) && front && back
		? checkSignInToken(uid, token).then(valid =>
			valid
				? deckId
					? firestore.doc(`users/${uid}/decks/${deckId}`).get().then(deck =>
						Permission.role(deck.get('role')) === PermissionRole.owner
							? Deck.collection(deckId, 'cards').add(Card.data(front, back, now)).then(_documentReference =>
								res.status(200).send('Successfully created card')
							)
							: res.status(403).send(`User is not the owner of deck ${deckId}`)
					)
					: newDeck
						? createNewDeckWithCard(uid, newDeck, front, back, now).then(deckData =>
							res.status(200).send(deckData)
						)
						: res.status(500).send('An error occurred creating a new deck. Please try again')
				: res.status(404).send('Invalid token')
		)
		: res.status(400).send('Specify a uid, token, (deck or newDeckName), front, and back')
})

function createNewDeckWithCard(uid: string, data: NewDeckData, front: string, back: string, date: Date = new Date): Promise<DeckData> {
	return firestore.collection('decks').add({
		name: data.name,
		subtitle: data.subtitle,
		description: '',
		tags: [],
		public: data.public,
		count: 0,
		views: { total: 0, unique: 0 },
		downloads: { total: 0, current: 0 },
		ratings: { average: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
		creator: uid,
		owner: uid,
		created: date,
		updated: date
	}).then(documentReference => {
		const deckId = documentReference.id
		const userData = { mastered: 0, hidden: false, role: Permission.stringify(PermissionRole.owner) }
		return Deck.view(uid, deckId).then(_writeResults =>
			Promise.all([
				firestore.doc(`users/${uid}/decks/${deckId}`).set(userData),
				Deck.collection(deckId, 'cards').add(Card.data(front, back, date))
			]).then(_results =>
				documentReference.get().then(deckData =>
					Object.assign(deckData, { image: Deck.defaultImageUrl, userData })
				)
			)
		)
	})
}

function checkSignInToken(uid: string, token: string): Promise<boolean> {
	const doc = firestore.doc(`users/${uid}/signInTokens/${token}`)
	return doc.get().then(snapshot =>
		snapshot.exists
			? doc.update({ date: new Date }).then(_writeResult => true)
			: false
	)
}

function checkPasswordForUser(user: admin.auth.UserRecord, password: string): boolean {
	return user.passwordHash === password
}

function sendNewSignInToken(uid: string, res: functions.Response): Promise<functions.Response> {
	const token = secure.newId(100)
	return firestore.doc(`users/${uid}/signInTokens/${token}`).set({ date: new Date }).then(_writeResult =>
		firestore.doc(`users/${uid}`).get().then(user =>
			res.status(200).send({ token, user: user.data() })
		)
	)
}