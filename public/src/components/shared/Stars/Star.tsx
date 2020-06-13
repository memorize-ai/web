import React, { memo } from 'react'

import WebP from '../../shared/WebP'

import star from '../../../images/icons/star.webp'
import starFallback from '../../../images/fallbacks/icons/star.jpg'

const Star = ({ fill }: { fill: number }) => (
	<div>
		<div style={{ width: `${fill}%` }} />
		<WebP
			src={star}
			fallback={starFallback}
			alt={`Star ${fill}%`}
		/>
	</div>
)

export default memo(Star)
