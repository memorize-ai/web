import React from 'react'

import star from '../../../images/icons/star.webp'

export default ({ fill }: { fill: number }) => (
	<div>
		<div style={{ width: `${fill}%` }} />
		<img src={star} alt={`Star ${fill}%`} />
	</div>
)
