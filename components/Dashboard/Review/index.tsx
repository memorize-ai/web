import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import useReviewState from './useReviewState'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import Navbar from './Navbar'
import CardContainer from './CardContainer'
import Footer from './Footer'
import ProgressModal from './ProgressModal'
import RecapModal from './RecapModal'

import styles from './index.module.scss'

interface ReviewQuery extends ParsedUrlQuery {
	slugId?: string
	slug?: string
	sectionId?: string
}

const Review = () => {
	const { slugId, slug, sectionId } = useRouter().query as ReviewQuery
	const {
		deck,
		card,
		loadingState,
		predictionLoadingState,
		isWaitingForRating,
		waitForRating,
		cardClassName,
		currentSide,
		currentIndex,
		count,
		flip,
		rate,
		progressData,
		isProgressModalShowing,
		setIsProgressModalShowing,
		recapData,
		isRecapModalShowing,
		setIsRecapModalShowing,
		showRecap
	} = useReviewState(slugId, slug, sectionId)

	const backUrl =
		slugId && slug ? `/decks/${slugId}/${encodeURIComponent(slug)}` : '/'

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={Selection.Decks}
			isNavbarHidden
			hideChat
			onClick={waitForRating}
		>
			<Head
				title={`Review${deck ? ` | ${deck.name}` : ''} | memorize.ai`}
				description={`Review${deck ? ` ${deck.name}` : ''} on memorize.ai`}
				breadcrumbs={() => []}
			/>
			<Navbar
				backUrl={backUrl}
				currentIndex={currentIndex}
				count={count}
				recap={showRecap}
			/>
			<CardContainer
				deck={deck}
				section={card && card.section}
				card={card}
				loadingState={loadingState}
				isWaitingForRating={isWaitingForRating}
				cardClassName={cardClassName}
				currentSide={currentSide}
				flip={flip}
			/>
			<Footer
				isWaitingForRating={isWaitingForRating}
				prediction={card && card.prediction}
				predictionLoadingState={predictionLoadingState}
				rate={rate}
			/>
			<ProgressModal
				data={progressData}
				isShowing={isProgressModalShowing}
				setIsShowing={setIsProgressModalShowing}
			/>
			<RecapModal
				data={recapData}
				backUrl={backUrl}
				isShowing={isRecapModalShowing}
				setIsShowing={setIsRecapModalShowing}
			/>
		</Dashboard>
	)
}

export default Review
