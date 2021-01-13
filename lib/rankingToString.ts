const rankingToString = (ranking: number) => {
	switch (ranking) {
		case 1:
			return '1st'
		case 2:
			return '2nd'
		case 3:
			return '3rd'
		default:
			return `${ranking}th`
	}
}

export default rankingToString
