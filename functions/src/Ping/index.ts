import axios from 'axios'

import { PING_KEY } from '../constants'

const BODY = { data: PING_KEY }

const FUNCTIONS = [
	'contactUser',
	'getCardPrediction',
	'getImportDeckDataFromQuizlet',
	'importDeckFromQuizlet',
	'reportMessage',
	'reviewCard'
]

const functionUrl = (name: string) =>
	`https://us-central1-memorize-ai.cloudfunctions.net/${name}`

export default () => Promise.all([
	axios.get('https://memorize.ai'),
	...FUNCTIONS.map(name =>
		axios.post(functionUrl(name), BODY)
	)
])
