import React from 'react'

import styles from '../../styles/components/TripleDots.module.scss'

export default ({ color }: { color: string }) => (
	<div>
		{[0, 1, 2].map(i => (
			<div
				key={i}
				className={styles.dot}
				style={{ background: color }}
			/>
		))}
	</div>
)
