import React, { memo } from 'react'

import Card from '../../../models/Card'
import CardSide from '../CardSide'

import '../../../scss/components/CardCell/Base.scss'

const CardCellBase = memo(({ card }: { card: Card }) => (
	<div className="sides">
		<div className="side">
			<CardSide itemProp="name">
				{card.front}
			</CardSide>
			<p>Front</p>
		</div>
		<div className="divider" />
		<div className="side">
			<CardSide>{card.back}</CardSide>
			<p>Back</p>
		</div>
	</div>
))

export default CardCellBase
