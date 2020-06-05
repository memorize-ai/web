import React, { memo } from 'react'

import Navbar from './Navbar'
import Sliders from './Sliders'
import CardContainer from './CardContainer'
import Footer from './Footer'

import '../../../scss/components/Dashboard/Cram.scss'

const CramContent = () => {
	return (
		<>
			<Navbar />
			<Sliders
				mastered={0}
				seen={0}
				unseen={0}
				total={0}
			/>
			<CardContainer />
			<Footer />
		</>
	)
}

export default memo(CramContent)
