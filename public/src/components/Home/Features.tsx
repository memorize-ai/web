import React, { memo } from 'react'

import WebP from '../shared/WebP'

import features from '../../images/home/features.webp'
import featuresFallback from '../../images/fallbacks/home/features.jpg'

import '../../scss/components/Home/Features.scss'

const HomeFeatures = () => (
	<div className="features">
		<h2 className="title">
			<strong>Everything you need</strong><br />
			to start memorizing
		</h2>
		<WebP
			src={features}
			fallback={featuresFallback}
			alt="Features"
		/>
	</div>
)

export default memo(HomeFeatures)
