export const flatten = <T>(array: T[][]): T[] =>
	([] as T[]).concat(...array)

export const firstWords = (sentence: string, count: number): string[] =>
	sentence.split(/\W/).filter(word => word.length).slice(0, count)

export const unique = <T>(elements: T[]): T[] =>
	[...new Set(elements)]

export const zeroFillLeft = <T>(array: T[], count: number): T[] => {
	const last = array.slice(-count)
	return last.length === count
		? last
		: [...Array(count - last.length).fill(0), ...last]
}
