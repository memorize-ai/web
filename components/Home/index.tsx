import { useEffect } from 'react'
import AOS from 'aos'

import PreviewDeck from 'models/PreviewDeck'
import Head from 'components/Head'
import TopGradient from 'components/TopGradient'
import Navbar from 'components/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Preview from './Preview'
import SectionDivider from './SectionDivider'
import Screenshots from './Screenshots'
import Classroom from './Classroom'
import Footer from './Footer'

export interface HomeProps {
	previewDeck: PreviewDeck
}

const Home = ({ previewDeck }: HomeProps) => {
	useEffect(() => {
		AOS.init({ anchorPlacement: 'top-bottom' })
	}, [])

	return (
		<div className="home">
			<Head
				url="/"
				title="memorize.ai: Learn Lazily"
				breadcrumbs={url => [[{ name: 'memorize.ai', url }]]}
			/>
			<TopGradient>
				<Navbar />
				<Header />
			</TopGradient>
			<SpacedRepetition />
			<Preview deck={previewDeck} />
			<SectionDivider />
			<Screenshots />
			<Classroom />
			<Footer />
		</div>
	)
}

export default Home
