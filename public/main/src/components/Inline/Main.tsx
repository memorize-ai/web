import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import Deck from '../../models/Deck'
import PerformanceRating from '../../models/PerformanceRating'
import LoadingState from '../../models/LoadingState'
import { _Card } from './models'
import CardSide from '../shared/CardSide'
import Loader from '../shared/Loader'
import RateButtons from './RateButtons'

import styles from '../../scss/components/Inline/Main.module.scss'

export interface InlineMainProps {
	deck: Deck | null
	card: _Card | null
	cardLoadingState: LoadingState
	predictionLoadingState: LoadingState
	rate: (rating: PerformanceRating) => void
}

const InlineMain = ({
	deck,
	card,
	cardLoadingState,
	predictionLoadingState,
	rate
}: InlineMainProps) => {
	const [isWaitingForRating, setIsWaitingForRating] = useState(false)
	
	const waitForRating = useCallback(() => {
		setIsWaitingForRating(true)
	}, [setIsWaitingForRating])
	
	return (
		<main
			className={cx(styles.root, {
				[styles.waitingForRating]: isWaitingForRating
			})}
			onClick={waitForRating}
		>
			<div className={styles.cards}>
				<div className={styles.card}>
					{card && cardLoadingState === LoadingState.Success
						? <CardSide>{card.value.front}</CardSide>
						: <Loader size="16px" thickness="3px" color="#4a4a4a" />
					}
				</div>
				<div className={cx(styles.card, styles.backgroundCard_1)} />
				<div className={cx(styles.card, styles.backgroundCard_2)} />
			</div>
			<footer className={styles.footer}>
				<p className={styles.waitForRating} tabIndex={-1}>
					Tap anywhere to continue
				</p>
				<RateButtons
					className={styles.rateButtons}
					prediction={null}
					predictionLoadingState={LoadingState.Loading}
					rate={rate}
				/>
			</footer>
		</main>
	)
}

export default InlineMain
