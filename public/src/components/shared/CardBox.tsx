import React from 'react'

import Card from '../../models/Card'

import '../../scss/components/CardBox.scss'

export default ({ card }: { card: Card }) => (
	<div className="card">
		<div className="content">
			<div
				className="front"
				dangerouslySetInnerHTML={{ __html: card.front }}
			/>
			<div
				className="back"
				dangerouslySetInnerHTML={{ __html: card.back }}
			/>
		</div>
		<div className="footer">
			FOOTER
		</div>
	</div>
)
