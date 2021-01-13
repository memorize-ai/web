import { Svg } from 'react-optimized-image'
import Confetti from 'react-dom-confetti'
import cx from 'classnames'

import PreviewDeck from 'models/PreviewDeck'
import usePreviewDeck from 'hooks/usePreviewDeck'
import usePreview, { UsePreviewCardActions } from '../../../hooks/usePreview'
import MarketSearchLink from 'components/MarketSearchLink'
import CardSide from 'components/CardSide'
import Footer from './Footer'
import ProgressModal from './ProgressModal'
import ClaimXPButton from './ClaimXPButton'
import Loader from 'components/Loader'
import rankingToString from 'lib/rankingToString'

import toggle from 'images/icons/toggle.svg'
import styles from './index.module.scss'

const CARD_ACTIONS: UsePreviewCardActions = {
	flip: styles.cardAction_flip,
	shift: styles.cardAction_shift
}

export interface PreviewProps {
	deck: PreviewDeck | null
}

const Preview = ({ deck: initialDeck }: PreviewProps) => {
	const deck = initialDeck ?? usePreviewDeck()
	const isLoading = !deck

	const {
		cardsRemaining,
		currentSide,
		isWaitingForRating,
		section,
		card,
		nextCard,
		predictions,
		cardClassName,
		toggleTurns,
		ranking,
		progressData,
		isProgressModalShowing,
		setIsProgressModalShowing,
		onCardClick,
		rate,
		waitForRating
	} = usePreview(deck, CARD_ACTIONS)

	return (
		<div id="preview" className={styles.root} onClick={waitForRating}>
			<div className={styles.background} />
			<div className={styles.content}>
				<h2 className={styles.title}>
					How good is <em>your</em> memory?
				</h2>
				<nav className={styles.navbar}>
					<div className={styles.navbarLocation}>
						<p className={styles.navbarLocationCount}>
							{isLoading ? '...' : cardsRemaining}
						</p>
						<p className={styles.navbarLocationText}>
							card{cardsRemaining === 1 ? '' : 's'} left
						</p>
					</div>
					<div className={styles.navbarItems}>
						<MarketSearchLink className={styles.search} />
						<ClaimXPButton className={styles.claim} />
					</div>
				</nav>
				<div className={styles.cardContainer}>
					<div
						className={cx(styles.location, {
							[styles.locationHidden]: !cardsRemaining
						})}
					>
						<p className={styles.locationDeck}>{deck?.name ?? '...'}</p>
						<div className={styles.locationDivider} />
						{section && (
							<p className={styles.locationSection}>{section.name}</p>
						)}
						{card && !card.forgotCount && (
							<p className={styles.locationFlag}>New</p>
						)}
					</div>
					<div className={styles.cards} onClick={onCardClick}>
						{(isLoading || card) && (
							<div
								className={cx(styles.card, styles.foreground, cardClassName, {
									[styles.waitingForFlip]: !isWaitingForRating
								})}
							>
								<div className={styles.sideContainer}>
									<CardSide className={styles.side} isLoading={isLoading}>
										{card?.[currentSide]}
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
							</div>
						)}
						{(isLoading || nextCard) && (
							<div className={cx(styles.card, styles.next)}>
								<div className={styles.sideContainer}>
									<CardSide className={styles.side}>{nextCard?.front}</CardSide>
								</div>
							</div>
						)}
						<div
							className={cx(styles.card, styles.backgroundCard_1, {
								[styles.hiddenCard]:
									cardsRemaining !== null && cardsRemaining < 2
							})}
						/>
						<div
							className={cx(styles.card, styles.backgroundCard_2, {
								[styles.hiddenCard]:
									cardsRemaining !== null && cardsRemaining < 3
							})}
						/>
						<div className={styles.completion}>
							<span
								className={styles.completionEmoji}
								role="img"
								aria-label="All done"
							>
								😌
							</span>
							<h3 className={styles.completionTitle}>
								Sign up to get <em>detailed performance insights</em>
							</h3>
							<h4 className={styles.completionSubtitle}>
								You ranked{' '}
								{ranking === null ? (
									<Loader
										className={styles.completionSubtitleLoader}
										size="20px"
										thickness="4px"
										color="white"
									/>
								) : (
									rankingToString(ranking)
								)}{' '}
								place in <em>{deck?.name ?? '...'}!</em>
							</h4>
							<div className={styles.confetti}>
								<Confetti
									active={!(cardsRemaining || isProgressModalShowing)}
									config={{
										duration: 5000,
										spread: 90,
										elementCount: 100
									}}
								/>
							</div>
						</div>
					</div>
				</div>
				<Footer
					isFinished={!(isLoading || cardsRemaining)}
					isWaitingForRating={isWaitingForRating}
					predictions={predictions}
					rate={rate}
				/>
			</div>
			<ProgressModal
				data={progressData}
				isShowing={isProgressModalShowing}
				setIsShowing={setIsProgressModalShowing}
			/>
		</div>
	)
}

export default Preview
