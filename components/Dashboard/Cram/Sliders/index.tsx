import Row from '../SliderRow'
import { safeDivide } from 'lib/utils'

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
			<Row fill={safeDivide(mastered, total)}>Mastered</Row>
			<Row fill={safeDivide(seen, total)}>Seen</Row>
			<Row fill={safeDivide(unseen, total)}>Unseen</Row>
		</tbody>
	</table>
)

export default CramSliders
