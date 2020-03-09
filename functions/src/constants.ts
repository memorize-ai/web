import * as functions from 'firebase-functions'
import Sender from 'send-mjml'

const config = functions.config()

export const DEBUG = false

export const DEFAULT_STORAGE_BUCKET = `memorize-ai${DEBUG ? '-dev' : ''}.appspot.com`

export const API_PREFIX = '_api'

export const EMAIL_SENDER = new Sender({
	service: 'gmail',
	email: 'support@gig.io',
	password: config.emails.support,
	defaultFrom: 'support@memorize.ai'
})
