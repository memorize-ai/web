import Row from '../SliderRow'

import styles from './index.module.scss'

export interface CramSlidersProps {
	mastered: number
	seen: number
	unseen: number
	total: number
}

const CramSliders = ({ mastered, seen, unseen, total }: CramSlidersProps) => (
	<table className={styles.root}>
		<tbody>
			<Row fill={mastered / (total || 1)}>Mastered</Row>
			<Row fill={seen / (total || 1)}>Seen</Row>
			<Row fill={unseen / (total || 1)}>Unseen</Row>
		</tbody>
	</table>
)

export default CramSliders
