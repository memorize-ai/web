import React, { HTMLAttributes } from 'react'

import styles from '../../styles/components/TopGradient.module.scss'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className={styles.root}>
		<div className={styles.background} />
		<div className={styles.content}>
			{children}
		</div>
	</div>
)
