export enum RatingType {
	easy,
	struggle,
	forgot
}

export default class Rating {
	type: RatingType

	constructor(rating: number) {
		this.type = rating < 3 ? RatingType.forgot : rating < 5 ? RatingType.struggle : RatingType.easy
	}
}