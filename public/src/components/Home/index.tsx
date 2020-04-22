import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import useQuery from '../../hooks/useQuery'
import useAuthModal from '../../hooks/useAuthModal'
import Head, { MobileApplication } from '../shared/Head'
import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import Header from './Header'
import Boxes from './Boxes'
import Screenshots from './Screenshots'
import Integrations from './Integrations'
import Footer from './Footer'
import firebase from '../../firebase'
import { APP_STORE_URL } from '../../constants'

import reviewScreenshot from '../../images/screenshots/review.png'

import 'firebase/analytics'

import '../../scss/components/Home/index.scss'

const analytics = firebase.analytics()

export default () => {
	analytics.setCurrentScreen('home')
	
	const history = useHistory()
	const next = useQuery().get('next')
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const image = `https://memorize.ai${reviewScreenshot}`
	
	useEffect(() => {
		if (!next)
			return
		
		setAuthModalIsShowing(true)
		setAuthModalCallback(() => history.push(next))
	}, [next]) // eslint-disable-line
	
	return (
		<div className="home-root">
			<Head<[MobileApplication]>
				title="memorize.ai: Do less, learn more"
				description="Do less. Learn more. Download on the app store for free, and change your life today."
				ogImage={image}
				schemaItems={[
					{
						'@type': 'MobileApplication',
						name: 'memorize.ai',
						operatingSystem: 'iOS',
						softwareVersion: '3.1.2',
						screenshot: image,
						downloadUrl: APP_STORE_URL,
						installUrl: APP_STORE_URL,
						author: 'memorize.ai',
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue: 5,
							ratingCount: 1,
							bestRating: 5,
							worstRating: 5
						},
						applicationCategory: 'Education',
						offers: {
							'@type': 'Offer',
							price: 0,
							priceCurrency: 'USD',
							seller: 'memorize.ai'
						}
					}
				]}
			/>
			<TopGradient>
				<Navbar />
				<Header />
				<Screenshots />
				<Boxes />
				<Integrations />
				<Footer />
			</TopGradient>
		</div>
	)
}
