import React from 'react'

import Card from '../../../models/Card'
import Base from './Base'

export default ({ card }: { card: Card }) => (
	<Base className="default" card={card} />
)
