import React from 'react'
import Confetti from 'react-dom-confetti'
import cx from 'classnames'

import usePreview from './usePreview'
import MarketSearchLink from '../../shared/MarketSearchLink'
import CardSide from '../../shared/CardSide'
import Footer from './Footer'
import ProgressModal from './ProgressModal'
import ClaimXPButton from './ClaimXPButton'
import Loader from '../../shared/Loader'
import { rankingToString } from '../../../utils'

import { ReactComponent as ToggleIcon } from '../../../images/icons/toggle.svg'

import '../../../scss/components/Home/Preview.scss'

const Preview = () => {
	const {
		cardsRemaining,
		currentSide,
		isWaitingForRating,
		deck,
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
	} = usePreview()
	
	return (
		<div id="preview" className="preview" onClick={waitForRating}>
			<div className="background" />
			<div className="content">
				<h2 className="title">
					How good is <em>your</em> memory?
				</h2>
				<div className="preview-navbar">
					<div className="location">
						<p className="count">{cardsRemaining}</p>
						<p className="text">card{cardsRemaining === 1 ? '' : 's'} left</p>
					</div>
					<div className="items">
						<MarketSearchLink />
						<ClaimXPButton />
					</div>
				</div>
				<div className="card-container">
					<div className={cx('location', { hidden: !cardsRemaining })}>
						<p className="deck">{deck.name}</p>
						<div className="divider" />
						{section && (
							<p className="section">{section.name}</p>
						)}
						{card && !card.forgotCount && (
							<p className="flag">New</p>
						)}
					</div>
					<div className="cards" onClick={onCardClick}>
						{card && (
							<div className={cx(
								'card',
								'foreground',
								cardClassName,
								{ 'waiting-for-flip': !isWaitingForRating }
							)}>
								<div className="container">
									<CardSide className="content">
										{card[currentSide]}
									</CardSide>
									{isWaitingForRating && (
										<div className="flip">
											<p>{currentSide}</p>
											<ToggleIcon style={{
												transform: `scale(3) rotate(${toggleTurns}turn)`
											}} />
										</div>
									)}
								</div>
							</div>
						)}
						{nextCard && (
							<div className="card next">
								<div className="container">
									<CardSide className="content">
										{nextCard.front}
									</CardSide>
								</div>
							</div>
						)}
						<div className={cx(
							'card',
							'background-1',
							{ hidden: cardsRemaining < 2 }
						)} />
						<div className={cx(
							'card',
							'background-2',
							{ hidden: cardsRemaining < 3 }
						)} />
						<div className="completion">
							<span className="emoji" role="img" aria-label="All done">
								😌
							</span>
							<h3 className="title">
								Sign up to get <em>detailed performance insights</em>
							</h3>
							<h4 className="subtitle">
								You ranked {
									ranking === null
										? <Loader size="20px" thickness="4px" color="white" />
										: rankingToString(ranking)
								} place in <em>{deck.name}!</em>
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
					isFinished={!cardsRemaining}
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
