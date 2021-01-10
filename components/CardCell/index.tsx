import cx from 'classnames'

import Card from 'models/Card'
import Base from './Base'

import styles from './index.module.scss'

export interface CardCellProps {
	className?: string
	card: Card
}

const CardCell = ({ className, card }: CardCellProps) => (
	<div
		className={cx(styles.root, className)}
		itemScope
		itemID={card.id}
		itemType="https://schema.org/Thing"
	>
		<Base card={card} />
	</div>
)

export default CardCell
