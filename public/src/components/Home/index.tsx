import React, { memo } from 'react'

import Head from '../shared/Head'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Screenshots from './Screenshots'
import Features from './Features'
import Classroom from './Classroom'
import Footer from './Footer'

const Home = () => (
	<div className="home">
		<Head
			title="memorize.ai: Do less, Learn more"
			breadcrumbs={[
				[
					{
						name: 'memorize.ai',
						url: 'https://memorize.ai'
					}
				]
			]}
		/>
		<TopGradient>
			<Navbar />
			<Header />
		</TopGradient>
		<SpacedRepetition />
		<Screenshots />
		<Features />
		<Classroom />
		<Footer />
	</div>
)

export default memo(Home)
