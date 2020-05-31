import React, { memo } from 'react'

import Star from './Star'

import '../../../scss/components/Stars.scss'

const Stars = memo(({ children: rating }: { children: number }) => (
	<div className="stars">
		{[0, 1, 2, 3, 4].map(offset => (
			<Star
				key={offset}
				fill={Math.min(1, Math.max(0, rating - offset)) * 100}
			/>
		))}
	</div>
))

export default Stars
