import * as functions from 'firebase-functions'
import * as express from 'express'
import * as moment from 'moment'
import { configure } from 'nunjucks'
import { join } from 'path'

import Deck from './Deck'
import { PermissionStatus } from './Permission'
import Invite from './Invite'

const app = express()
const _app = functions.https.onRequest(app)
export { _app as app }

configure(join(__dirname, '../views'), {
	autoescape: true,
	express: app
})

app.get('/d/:deckId', (req, res) => {
	const deckId = req.params.deckId
	return Deck.doc(deckId).get().then(deck =>
		deck.exists
			? Deck.image(deckId).then(image => {
				const name = deck.get('name')
				res.render('deck.html', {
					title: name,
					image_url: image,
					deck_name: name,
					deck_subtitle: deck.get('subtitle'),
					deck_tags: deck.get('tags')
				})
			})
			: res.render('404.html', {
				title: 'Invalid deck URL',
				has_404_banner: false,
				large_text: 'Invalid deck URL',
				has_text: false,
				button_text: 'Marketplace',
				button_href: '/decks'
			})
	)
})

app.get('/i/:inviteId', (req, res) =>
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
				button_href: '/dashboard?menu=invites'
			})
	).catch(_error =>
		res.render('404.html', {
			title: 'Invalid invite',
			has_404_banner: false,
			large_text: 'Invalid invite URL',
			has_text: false,
			button_text: 'Your invites',
			button_href: '/dashboard?menu=invites'
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
		button_href: '/dashboard'
	})
)