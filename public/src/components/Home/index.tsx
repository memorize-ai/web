import React, { memo } from 'react'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Screenshots from './Screenshots'
import Features from './Features'
import Classroom from './Classroom'
import Footer from './Footer'

const Home = memo(() => (
	<div className="home">
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
))

export default Home
