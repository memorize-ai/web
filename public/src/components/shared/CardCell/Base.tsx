import React, { PropsWithChildren } from 'react'
import cx from 'classnames'

import Card from '../../../models/Card'

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
					<div dangerouslySetInnerHTML={{ __html: card.front }} />
					<p>Front</p>
				</div>
				<div className="divider" />
				<div className="side">
					<div dangerouslySetInnerHTML={{ __html: card.back }} />
					<p>Back</p>
				</div>
			</div>
			{children}
		</div>
	)
}
