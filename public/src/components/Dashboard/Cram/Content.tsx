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
			<Sliders />
			<CardContainer />
			<Footer />
		</>
	)
}

export default memo(CramContent)
