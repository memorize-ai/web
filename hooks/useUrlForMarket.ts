import { useRecoilValue } from 'recoil'
import { UrlObject } from 'url'

import searchState from 'state/search'
import { flattenQuery } from 'lib/utils'

const useUrlForMarket = (): UrlObject => {
	const { query, sortAlgorithm } = useRecoilValue(searchState)

	return {
		pathname: '/market',
		query: flattenQuery({
			q: query,
			s: sortAlgorithm === 'recommended' ? null : sortAlgorithm
		})
	}
}

export default useUrlForMarket
