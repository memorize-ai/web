import React from 'react'
import cx from 'classnames'

import Deck from '../../models/Deck'
import PerformanceRating from '../../models/PerformanceRating'

import styles from '../../scss/components/Inline/Main.module.scss'

export interface InlineMainProps {
	deck: Deck | null
	rate: (rating: PerformanceRating) => void
}

const InlineMain = ({ deck, rate }: InlineMainProps) => {
	return (
		<main className={styles.root}>
			<div className={styles.cards}>
				<div className={styles.card} />
				<div className={cx(styles.card, styles.backgroundCard_1)} />
				<div className={cx(styles.card, styles.backgroundCard_2)} />
			</div>
			<footer className={styles.footer}>
				<p className={styles.waitingForRating}>
					Tap anywhere to continue
				</p>
			</footer>
		</main>
	)
}

export default InlineMain
