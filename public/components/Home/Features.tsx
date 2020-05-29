import React from 'react'

import featuresImage from 'images/home/features.webp'

import styles from 'styles/components/Home/Features.module.scss'

export default () => (
	<div className="features">
		<h2 className="title">
			<strong>Everything you need</strong><br />
			to start memorizing
		</h2>
		<img src={featuresImage} alt="Features" />
	</div>
)
