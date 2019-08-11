export const DEFAULT_E = 2.5
export const MINIMUM_E = 1.3

export default class SM2 {
	static interval(e: number, streak: number): number {
		return streak > 2 ? Math.round(6 * e ** (streak - 2)) : streak === 2 ? 6 : streak
	}

	static e(e: number, rating: number): number {
		return Math.max(MINIMUM_E, e - 0.8 + 0.28 * rating - 0.02 * rating ** 2)
	}
}