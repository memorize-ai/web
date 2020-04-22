import React from 'react'

import Card from '../../../models/Card'
import Base from './Base'

export default ({ card }: { card: Card }) => (
	<div className="card-cell default">
		<Base card={card} />
	</div>
)
