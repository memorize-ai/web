import React from 'react'

import Card from '../../../models/Card'
import Base from './Base'

import '../../../scss/components/CardCell/index.scss'

export default ({ card }: { card: Card }) => (
	<Base className="default" card={card} />
)
