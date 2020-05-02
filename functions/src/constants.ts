import * as functions from 'firebase-functions'

const config = functions.config()

export const DEBUG = false

export const DEFAULT_STORAGE_BUCKET = `memorize-ai${DEBUG ? '-dev' : ''}.appspot.com`

export const API_PREFIX = '_api'

export const DECK_DUE_CARD_COUNT_SCHEDULE = 'every 5 minutes'

export const EMAIL_SCHEDULE = '0 12 * * *'

export const PRERENDER_TOKEN = config.prerender.token
