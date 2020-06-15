import React, { memo, useEffect } from 'react'
import AOS from 'aos'

import Head from '../shared/Head'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Screenshots from './Screenshots'
import Features from './Features'
import Classroom from './Classroom'
import Footer from './Footer'

import 'aos/dist/aos.css'

const Home = () => {
	useEffect(() => {
		AOS.init()
	}, [])
	
	return (
		<div className="home">
			<Head
				title="memorize.ai: Intelligent flashcards"
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
}

export default memo(Home)
