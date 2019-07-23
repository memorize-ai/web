import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as secure from 'securejs'

import Deck from './Deck'

const firestore = admin.firestore()
const auth = admin.auth()

export const getUserSignInToken = functions.https.onRequest((req, res) => {
	const password = req.query.password
	const email = req.query.email
	const uid = req.query.uid
	if (!((email || uid) && password)) return res.status(400).send('Specify a uid or email')
	const getUser = email ? auth.getUserByEmail(email) : auth.getUser(uid)
	return getUser.then(user =>
		checkPasswordForUser(user, password)
			? sendNewSignInToken(user.uid, res)
			: res.send(401).send('Invalid password')
	).catch(_error =>
		res.send(403).send(`Invalid ${email ? 'email' : 'uid'}`)
	)
})

export const checkUserSignInToken = functions.https.onRequest((req, res) => {
	const uid = req.query.uid
	const token = req.query.token
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
	const uid = req.query.uid
	const token = req.query.token
	if (!(uid && token)) return res.status(400).send('Specify a uid and token')
	return checkSignInToken(uid, token).then(valid =>
		valid
			? firestore.collection(`users/${uid}/decks`).where('hidden', '==', false).get().then(userDecks =>
				Promise.all(userDecks.docs.map(userDeck =>
					firestore.doc(`decks/${userDeck.id}`).get().then(deck =>
						Deck.image(deck).then(image =>
							Object.assign(deck.data() || {}, { image, userData: userDeck.data() })
						)
					)
				)).then(decks =>
					res.status(200).send(decks)
				)
			)
			: res.status(404).send('Invalid token')
	)
})

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