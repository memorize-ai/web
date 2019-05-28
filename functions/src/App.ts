import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import { configure } from 'nunjucks'
import moment from 'moment'

import Permission from './Permission'

const app = express()
const firestore = admin.firestore()
const auth = admin.auth()

export default functions.https.onRequest(app)

configure('../views', {
	autoescape: true,
	express: app
})

app.get('/invites/:deckId', (req, res) => {
	const token = req.cookies.__session
	return token
		? auth.verifyIdToken(token).then(decodedToken => {
			const uid = decodedToken.uid
			return firestore.doc(`users/${uid}/invites/${req.params.deckId}`).get().then(invite =>
				invite.exists
					? Permission.isPending(invite)
						? res.render('invite.html', {
							
						})
						: res.render('404.html', {
							title: 'Expired invite',
							has_404_banner: false,
							large_text: 'Expired invite',
							has_text: true,
							text: `You ${Permission.isDeclined(invite) ? 'declined' : 'accepted'} this invite on ${moment(invite.get('confirmed')).format('LL')}`,
							button_text: 'Your invites',
							button_href: '/dashboard?menu=invites'
						})
					: res.render('404.html', {
						title: 'Invalid invite URL',
						has_404_banner: false,
						large_text: 'Invalid invite URL',
						has_text: false,
						button_text: 'Your invites',
						button_href: '/dashboard?menu=invites'
					})
			)
		})
		: res.status(403).redirect('/login')
})

app.get('*', (_req, res) =>
	res.render('404.html', {
		title: '404',
		has_404_banner: true,
		large_text: 'Check the URL and try again',
		has_text: false,
		button_text: 'Your dashboard',
		button_href: '/dashboard'
	})
)