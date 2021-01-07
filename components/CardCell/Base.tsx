import Card from 'models/Card'
import CardSide from 'components/CardSide'

const CardCellBase = ({ card }: { card: Card }) => (
	<div className="sides">
		<div className="side">
			<CardSide itemProp="name">{card.front}</CardSide>
			<p>Front</p>
		</div>
		<div className="divider" />
		<div className="side">
			<CardSide>{card.back}</CardSide>
			<p>Back</p>
		</div>
	</div>
)

export default CardCellBase
