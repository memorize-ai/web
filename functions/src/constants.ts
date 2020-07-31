import * as functions from 'firebase-functions'

const config = functions.config()

export const DEBUG = false

export const DEFAULT_STORAGE_BUCKET = `memorize-ai${DEBUG ? '-dev' : ''}.appspot.com`

export const API_PREFIX = '_api'

export const DECK_DUE_CARD_COUNT_SCHEDULE = 'every 5 minutes'

export const PRERENDER_TOKEN: string = config.prerender.token
export const SENDGRID_API_KEY: string = config.sendgrid.api_key

export const SUPPORT_EMAIL = 'support@memorize.ai'

export const SLACK_INVITE_URL = 'https://join.slack.com/t/memorizeai/shared_invite/zt-fonasrkz-~lttgde~yDum5IMiAydXNQ'
