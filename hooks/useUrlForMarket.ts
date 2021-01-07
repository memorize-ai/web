import { UrlObject } from 'url'

import useSearchState from './useSearchState'
import { flattenQuery } from 'lib/utils'

const useUrlForMarket = (): UrlObject => {
	const [{ query, sortAlgorithm }] = useSearchState()

	return {
		pathname: '/market',
		query: flattenQuery({
			q: query,
			s: sortAlgorithm === 'recommended' ? null : sortAlgorithm
		})
	}
}

export default useUrlForMarket
