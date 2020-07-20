import React, { lazy, memo } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import useSearchState from '../../../hooks/useSearchState'
import { urlWithQuery } from '../../../utils'

export const urlForMarket = () => {
	const [{ query, sortAlgorithm }] = useSearchState() // eslint-disable-line
	
	return urlWithQuery('/market', {
		q: query,
		s: sortAlgorithm === 'recommended'
			? null
			: sortAlgorithm
	})
}

const Content = lazy(() => import('./Content'))

const Market = () => (
	<Dashboard selection={Selection.Market} className="market">
		<Content />
	</Dashboard>
)

export default memo(Market)
