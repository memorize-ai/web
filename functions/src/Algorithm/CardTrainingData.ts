import Card from '../Card'
import History from '../History'

export default class CardTrainingData {
	card: Card
	history: History[]
	
	constructor(card: Card, history: History[]) {
		this.card = card
		this.history = history
	}
	
	get intervals() {
		return this.history.map(({ elapsed }) => elapsed)
	}
}
