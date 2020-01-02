import Card from '../Card'
import History from '../History'

export default class CardTrainingData {
	card: Card
	history: History[]
	
	constructor(card: Card, history: History[]) {
		this.card = card
		this.history = history
	}
	
	get intervals(): number[] {
		return this.history.map(({ elapsed }) => elapsed)
	}
	
	get last(): History {
		let max = this.history[0]
		
		for (const history of this.history)
			if (history.date > max.date)
				max = history
		
		return max
	}
	
	get elapsed(): number {
		return Date.now() - this.last.date.getTime()
	}
}
