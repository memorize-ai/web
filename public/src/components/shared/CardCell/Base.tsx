import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

import Card from '../../../models/Card'
import CardSide from '../CardSide'

import '../../../scss/components/CardCell/Base.scss'

export default (
	{ className, card, children }: PropsWithChildren<{
		className: string
		card: Card
	}>
) => {
	return (
		<div className={cx('card-cell', className)}>
			<div className="sides">
				<div className="side">
					<CardSide>{card.front}</CardSide>
					<p>Front</p>
				</div>
				<div className="divider" />
				<div className="side">
					<CardSide>{card.back}</CardSide>
					<p>Back</p>
				</div>
			</div>
			{children}
		</div>
	)
}
