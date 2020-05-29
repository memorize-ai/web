import React from 'react'

import styles from 'styles/components/TripleDots.module.scss'

export default ({ color }: { color: string }) => (
	<div className="triple-dots">
		{[0, 1, 2].map(i => (
			<div key={i} style={{ background: color }} />
		))}
	</div>
)
