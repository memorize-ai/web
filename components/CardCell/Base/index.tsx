import Card from 'models/Card'
import CardSide from 'components/CardSide'

import styles from './index.module.scss'

export interface CardCellBaseProps {
	card: Card
}

const CardCellBase = ({ card }: CardCellBaseProps) => (
	<div className={styles.sides}>
		<div className={styles.side}>
			<CardSide className={styles.content} itemProp="name">
				{card.front}
			</CardSide>
			<span className={styles.text}>Front</span>
		</div>
		<div className={styles.divider} />
		<div className={styles.side}>
			<CardSide className={styles.content}>{card.back}</CardSide>
			<span className={styles.text}>Back</span>
		</div>
	</div>
)

export default CardCellBase
