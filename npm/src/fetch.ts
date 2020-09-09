import axios from 'axios'

import queryToString, { Query } from './query'
import MemorizeError from './error'

const url = (path: string, query: Query) =>
	`https://memorize.ai/_api/${path}${queryToString(query)}`

export default (path: string, query: Query) =>
	axios.get(url(path, query))
		.then(({ data }) => data)
		.catch(({ response: { data, status, statusText } }) => {
			throw new MemorizeError(
				{ code: status, message: statusText },
				data
			)
		})
