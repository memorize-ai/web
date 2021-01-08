import { Svg } from 'react-optimized-image'
import Confetti from 'react-dom-confetti'
import cx from 'classnames'

import PreviewDeck from 'models/PreviewDeck'
import usePreviewDeck from 'hooks/usePreviewDeck'
import usePreview from './usePreview'
import MarketSearchLink from 'components/MarketSearchLink'
import CardSide from 'components/CardSide'
import Footer from './Footer'
import ProgressModal from './ProgressModal'
import ClaimXPButton from './ClaimXPButton'
import Loader from 'components/Loader'
import { rankingToString } from 'lib/utils'

import toggle from 'images/icons/toggle.svg'

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
	} = usePreview(deck)

	return (
		<div id="preview" className="preview" onClick={waitForRating}>
			<div className="background" />
			<div className="content">
				<h2 className="title">
					How good is <em>your</em> memory?
				</h2>
				<div className="preview-navbar">
					<div className="location">
						<p className="count">{isLoading ? '...' : cardsRemaining}</p>
						<p className="text">card{cardsRemaining === 1 ? '' : 's'} left</p>
					</div>
					<div className="items">
						<MarketSearchLink />
						<ClaimXPButton />
					</div>
				</div>
				<div className="card-container">
					<div className={cx('location', { hidden: !cardsRemaining })}>
						<p className="deck">{deck?.name ?? '...'}</p>
						<div className="divider" />
						{section && <p className="section">{section.name}</p>}
						{card && !card.forgotCount && <p className="flag">New</p>}
					</div>
					<div className="cards" onClick={onCardClick}>
						{(isLoading || card) && (
							<div
								className={cx('card', 'foreground', cardClassName, {
									'waiting-for-flip': !isWaitingForRating
								})}
							>
								<div className="container">
									<CardSide className="content" isLoading={isLoading}>
										{card?.[currentSide]}
									</CardSide>
									{isWaitingForRating && (
										<div className="flip">
											<p>{currentSide}</p>
											<Svg
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
							<div className="card next">
								<div className="container">
									<CardSide className="content">{nextCard?.front}</CardSide>
								</div>
							</div>
						)}
						<div
							className={cx('card', 'background-1', {
								hidden: cardsRemaining !== null && cardsRemaining < 2
							})}
						/>
						<div
							className={cx('card', 'background-2', {
								hidden: cardsRemaining !== null && cardsRemaining < 3
							})}
						/>
						<div className="completion">
							<span className="emoji" role="img" aria-label="All done">
								😌
							</span>
							<h3 className="title">
								Sign up to get <em>detailed performance insights</em>
							</h3>
							<h4 className="subtitle">
								You ranked{' '}
								{ranking === null ? (
									<Loader size="20px" thickness="4px" color="white" />
								) : (
									rankingToString(ranking)
								)}{' '}
								place in <em>{deck?.name ?? '...'}!</em>
							</h4>
							<div className="confetti">
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
