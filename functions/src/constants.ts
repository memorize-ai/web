import * as functions from 'firebase-functions'
import { join } from 'path'

const config = functions.config()

export const DEFAULT_STORAGE_BUCKET = 'memorize-ai.appspot.com'

export const BASE_PATH = join(__dirname, '../..')

export const API_PREFIX = 'api'
export const PRIVATE_API_PREFIX = '_api'

export const DECK_DUE_CARD_COUNT_SCHEDULE = 'every 10 minutes'
export const PING_SCHEDULE = 'every 1 minutes'

export const PRERENDER_TOKEN: string = config.prerender.token
export const SENDGRID_API_KEY: string = config.sendgrid.api_key

export const PING_KEY: string = config.ping.key
export const ADMIN_KEY: string = config.admin.key

export const SUPPORT_ID = 's6yreK4ZTRfIjxiYsch0ze1YnR93'
export const SUPPORT_EMAIL = 'support@memorize.ai'

export const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24
