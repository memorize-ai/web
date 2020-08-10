import React from 'react'

import '../../scss/components/TripleDots.scss'

const TripleDots = ({ color }: { color: string }) => (
	<div className="triple-dots">
		{[0, 1, 2].map(i => (
			<div key={i} style={{ background: color }} />
		))}
	</div>
)

export default TripleDots
