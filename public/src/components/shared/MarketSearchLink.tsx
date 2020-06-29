import React, { useCallback, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import useSearchState from '../../hooks/useSearchState'
import { urlForMarket } from '../Dashboard/Market'
import { DEFAULT_DECK_COUNT } from '../../constants'

import '../../scss/components/MarketSearchLink.scss'

const MarketSearchLink = () => {
	const history = useHistory()
	
	const [{ query }] = useSearchState()
	const marketUrl = urlForMarket()
	
	const goToMarket = useCallback(() => {
		history.push(marketUrl)
	}, [history, marketUrl])
	
	return (
		<div className="market-search-link">
			<input
				readOnly
				placeholder={`Explore ${DEFAULT_DECK_COUNT} decks`}
				value={query}
				onFocus={goToMarket}
				tabIndex={-1}
			/>
			<FontAwesomeIcon icon={faSearch} />
		</div>
	)
}

export default memo(MarketSearchLink)
