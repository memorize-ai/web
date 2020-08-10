import React, { memo, useEffect } from 'react'
import AOS from 'aos'

import Head from '../shared/Head'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Preview from './Preview'
import SectionDivider from './SectionDivider'
import Screenshots from './Screenshots'
import Classroom from './Classroom'
import Footer from './Footer'

import '../../scss/components/Home/index.scss'

const Home = () => {
	useEffect(() => {
		AOS.init({ anchorPlacement: 'top-bottom' })
	}, [])
	
	return (
		<div className="home">
			<Head
				title="memorize.ai: Learn Lazily"
				canonicalUrl="https://memorize.ai"
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
			<Preview />
			<SectionDivider />
			<Screenshots />
			<Classroom />
			<Footer />
		</div>
	)
}

export default Home
