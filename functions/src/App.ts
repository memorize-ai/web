import * as functions from 'firebase-functions'
import * as express from 'express'
import * as moment from 'moment'
import { configure } from 'nunjucks'
import { join } from 'path'

import { PermissionStatus } from './Permission'
import Invite from './Invite'

const app = express()
const _app = functions.https.onRequest(app)
export { _app as app }

configure(join(__dirname, '../views'), {
	autoescape: true,
	express: app
})

app.get('/invites/:inviteId', (req, res) =>
	Invite.fromId(req.params.inviteId).then(invite =>
		invite.status === PermissionStatus.pending
			? res.render('invite.html', {
				
			})
			: res.render('404.html', {
				title: 'Expired invite',
				has_404_banner: false,
				large_text: 'Expired invite',
				has_text: true,
				text: `You ${invite.status === PermissionStatus.accepted ? 'accepted' : 'declined'} this invite on ${moment(invite.confirmed || new Date).format('LL')}`,
				button_text: 'Your invites',
				button_href: 'https://memorize.ai/dashboard?menu=invites'
			})
	).catch(_error =>
		res.render('404.html', {
			title: 'Invalid invite URL',
			has_404_banner: false,
			large_text: 'Invalid invite URL',
			has_text: false,
			button_text: 'Your invites',
			button_href: 'https://memorize.ai/dashboard?menu=invites'
		})
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