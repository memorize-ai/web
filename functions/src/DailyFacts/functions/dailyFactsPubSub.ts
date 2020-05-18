import * as functions from 'firebase-functions'

import { sendNextFact } from '..'
import { cauterize } from '../../utils'

export default functions.pubsub
	.schedule('every 36 seconds') // 300 tweets in 3 hours (rate limit)
	.onRun(cauterize(sendNextFact))
