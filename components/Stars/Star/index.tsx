import Img from 'react-optimized-image'

import star from 'images/icons/star.jpg'
import styles from './index.module.scss'

const Star = ({ fill }: { fill: number }) => (
	<div className={styles.root}>
		<div className={styles.background} style={{ width: `${fill}%` }} />
		<Img src={star} alt={`Star ${fill}%`} webp original />
	</div>
)

export default Star
