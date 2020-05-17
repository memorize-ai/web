import * as functions from 'firebase-functions'

import DailyFacts from '..'
import { cauterize } from '../../utils'

export default functions.pubsub
	.schedule('every 36 seconds') // 300 tweets in 3 hours (rate limit)
	.onRun(cauterize(DailyFacts.sendNext))
