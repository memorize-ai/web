import React from 'react'

import Card from 'models/Card'
import CardSide from 'components/shared/CardSide'

import styles from 'styles/components/CardCell/Base.module.scss'

export default ({ card }: { card: Card }) => (
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
)
