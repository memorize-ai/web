import React, { memo } from 'react'

import star from '../../../images/icons/star.webp'

const Star = memo(({ fill }: { fill: number }) => (
	<div>
		<div style={{ width: `${fill}%` }} />
		<img src={star} alt={`Star ${fill}%`} />
	</div>
))

export default Star
