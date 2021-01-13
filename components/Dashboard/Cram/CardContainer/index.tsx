import { useCallback, MouseEvent, useState, useEffect, useMemo } from 'react'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import { CardActions } from '../useCramState'
import Deck from 'models/Deck'
import Section from 'models/Section'
import LoadingState from 'models/LoadingState'
import { CramCard } from '../useCramState'
import CardSide from 'components/CardSide'
import Loader from 'components/Loader'

import toggle from 'images/icons/toggle.svg'
import styles from './index.module.scss'

export const CARD_ACTIONS: CardActions = {
	flip: styles.cardAction_flip,
	shift: styles.cardAction_shift
}

export interface CramCardContainerProps {
	deck: Deck | null
	section: Section | null
	card: CramCard | null
	loadingState: LoadingState
	isWaitingForRating: boolean
	cardClassName: string | undefined
	currentSide: 'front' | 'back'
	flip(): void
}

const CramCardContainer = ({
	deck,
	section,
	card,
	loadingState,
	isWaitingForRating,
	cardClassName,
	currentSide,
	flip
}: CramCardContainerProps) => {
	const [toggleTurns, setToggleTurns] = useState(0)

	const isReady = useMemo(() => card && loadingState === LoadingState.Success, [
		card,
		loadingState
	])

	const onCardClick = useCallback(
		(event: MouseEvent) => {
			if (!isWaitingForRating) return

			event.stopPropagation()
			flip()
		},
		[isWaitingForRating, flip]
	)

	useEffect(() => {
		setToggleTurns(turns => turns + 1)
	}, [currentSide, setToggleTurns])

	return (
		<div className={styles.root}>
			<div className={styles.location}>
				{deck ? (
					<p className={styles.deck}>{deck.name}</p>
				) : (
					<Loader size="20px" thickness="4px" color="white" />
				)}
				{section && (
					<>
						<div className={styles.locationDivider} />
						<p className={styles.section}>{section.name}</p>
					</>
				)}
				{card?.isNew && <p className={styles.flag}>New</p>}
			</div>
			<div
				className={cx(styles.cards, {
					[styles.clickable]: isWaitingForRating
				})}
				onClick={onCardClick}
			>
				<div
					className={cx(styles.card, cardClassName, {
						[styles.loading]: !isReady
					})}
				>
					{card && isReady ? (
						<div className={styles.container}>
							<CardSide className={styles.content}>
								{card.value[currentSide]}
							</CardSide>
							{isWaitingForRating && (
								<div className={styles.flip}>
									<p className={styles.flipSide}>{currentSide}</p>
									<Svg
										className={styles.flipIcon}
										src={toggle}
										viewBox={`0 0 ${toggle.width} ${toggle.height}`}
										style={{
											transform: `scale(3) rotate(${toggleTurns}turn)`
										}}
									/>
								</div>
							)}
						</div>
					) : (
						<Loader size="30px" thickness="5px" color="#582efe" />
					)}
				</div>
				<div className={cx(styles.card, styles.background_1)} />
				<div className={cx(styles.card, styles.background_2)} />
			</div>
		</div>
	)
}

export default CramCardContainer
