import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

import useCramState from './useCramState'
import Dashboard, {
	DashboardNavbarSelection as Selection,
	DashboardGradientStyle as GradientStyle
} from 'components/Dashboard'
import Head from 'components/Head'
import Navbar from './Navbar'
import Sliders from './Sliders'
import CardContainer from './CardContainer'
import Footer from './Footer'
import ProgressModal from './ProgressModal'
import RecapModal from './RecapModal'

interface CramQuery extends ParsedUrlQuery {
	slugId: string
	slug: string
	sectionId: string
}

const Cram = () => {
	const { slugId, slug, sectionId } = useRouter().query as CramQuery
	const {
		deck,
		section,
		card,
		currentIndex,
		count,
		loadingState,
		isWaitingForRating,
		waitForRating,
		cardClassName,
		progressData,
		isProgressModalShowing,
		setIsProgressModalShowing,
		recapData,
		isRecapModalShowing,
		setIsRecapModalShowing,
		showRecap,
		counts: { mastered, seen, unseen },
		currentSide,
		flip,
		skip,
		rate
	} = useCramState(slugId, slug, sectionId)

	const backUrl = `/decks/${slugId}/${slug}`

	return (
		<Dashboard
			selection={Selection.Decks}
			gradientStyle={GradientStyle.Green}
			isNavbarHidden
			hideChat
			className="cram"
		>
			<div className="mask" onClick={waitForRating}>
				<Head
					title={`Cram${deck ? ` | ${deck.name}` : ''} | memorize.ai`}
					description={`Cram${deck ? ` ${deck.name}` : ''} on memorize.ai`}
					breadcrumbs={() => []}
				/>
				<Navbar
					backUrl={backUrl}
					currentIndex={currentIndex}
					count={count}
					skip={skip}
					recap={showRecap}
				/>
				<Sliders
					mastered={mastered}
					seen={seen}
					unseen={unseen}
					total={count ?? 0}
				/>
				<CardContainer
					deck={deck}
					section={section}
					card={card}
					loadingState={loadingState}
					isWaitingForRating={isWaitingForRating}
					cardClassName={cardClassName}
					currentSide={currentSide}
					flip={flip}
				/>
				<Footer isWaitingForRating={isWaitingForRating} rate={rate} />
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
			</div>
		</Dashboard>
	)
}

export default Cram
