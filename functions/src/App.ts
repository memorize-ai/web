import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as moment from 'moment'
import { configure } from 'nunjucks'
import { join } from 'path'

import Permission from './Permission'

const app = express()
const _app = functions.https.onRequest(app)
export { _app as app }

const firestore = admin.firestore()
const auth = admin.auth()

configure(join(__dirname, '../views'), {
	autoescape: true,
	express: app
})

function getUid(req: functions.Request): Promise<string> {
	const session = req.cookies ? req.cookies.__session : undefined
	return session
		? auth.verifyIdToken(session).then(token => token.uid)
		: Promise.reject()
}

app.get('/invites/:deckId', (req, res) =>
	getUid(req).then(uid =>
		firestore.doc(`users/${uid}/invites/${req.params.deckId}`).get().then(invite =>
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
						button_href: 'https://memorize.ai/dashboard?menu=invites'
					})
				: res.render('404.html', {
					title: 'Invalid invite URL',
					has_404_banner: false,
					large_text: 'Invalid invite URL',
					has_text: false,
					button_text: 'Your invites',
					button_href: 'https://memorize.ai/dashboard?menu=invites'
				})
		)
	).catch(() =>
		res.redirect('https://memorize.ai/login')
	)
)

app.get('*', (_req, res) =>
	res.render('404.html', {
		title: '404',
		has_404_banner: true,
		large_text: 'Check the URL and try again',
		has_text: false,
		button_text: 'Your dashboard',
		button_href: 'https://memorize.ai/dashboard'
	})
)