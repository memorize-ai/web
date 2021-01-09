import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import Router from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import searchState from 'state/search'
import useUrlForMarket from 'hooks/useUrlForMarket'
import { DEFAULT_DECK_COUNT } from 'lib/constants'

import styles from './index.module.scss'

export interface MarketSearchLinkProps {
	className?: string
}

const MarketSearchLink = ({ className }: MarketSearchLinkProps) => {
	const { query } = useRecoilValue(searchState)
	const marketUrl = useUrlForMarket()

	const goToMarket = useCallback(() => {
		Router.push(marketUrl)
	}, [marketUrl])

	return (
		<div className={cx(styles.root, className)} onClick={goToMarket}>
			<input
				className={styles.input}
				readOnly
				placeholder={`Explore ${DEFAULT_DECK_COUNT} decks`}
				value={query}
			/>
			<FontAwesomeIcon className={styles.icon} icon={faSearch} />
		</div>
	)
}

export default MarketSearchLink
