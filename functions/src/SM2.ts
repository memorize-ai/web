export default class SM2 {
	static interval(e: number, streak: number): number {
		return streak > 2 ? Math.round(6 * e ** (streak - 2)) : streak === 2 ? 6 : streak
	}

	static e(e: number, rating: number): number {
		return Math.max(1.3, e - 0.8 + 0.28 * rating - 0.02 * rating ** 2)
	}
}