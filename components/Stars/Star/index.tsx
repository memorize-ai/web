import Img from 'react-optimized-image'

import star from 'images/icons/star.jpg'
import styles from './index.module.scss'

export interface StarProps {
	fill: number
}

const Star = ({ fill }: StarProps) => (
	<div className={styles.root}>
		<div className={styles.background} style={{ width: `${fill}%` }} />
		<Img
			className={styles.image}
			src={star}
			alt={`Star ${fill}%`}
			webp
			original
		/>
	</div>
)

export default Star
