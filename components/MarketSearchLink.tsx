import { useCallback } from 'react'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import useSearchState from 'hooks/useSearchState'
import useUrlForMarket from 'hooks/useUrlForMarket'
import { DEFAULT_DECK_COUNT } from 'lib/constants'

const MarketSearchLink = () => {
	const [{ query }] = useSearchState()
	const marketUrl = useUrlForMarket()
	
	const goToMarket = useCallback(() => {
		Router.push(marketUrl)
	}, [marketUrl])
	
	return (
		<div className="market-search-link" onClick={goToMarket}>
			<input
				readOnly
				placeholder={`Explore ${DEFAULT_DECK_COUNT} decks`}
				value={query}
			/>
			<FontAwesomeIcon icon={faSearch} />
		</div>
	)
}

export default MarketSearchLink
