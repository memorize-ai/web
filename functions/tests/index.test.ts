import { flatten, firstWords, unique, zeroFillLeft } from '../src/Helpers'

it('flattens arrays', () => {
	expect(flatten([[1], [2, 3], [4], [5]])).toStrictEqual([1, 2, 3, 4, 5])
	expect(flatten([])).toStrictEqual([])
	expect(flatten([[1]])).toStrictEqual([1])
})

it('gets first words', () => {
	expect(firstWords('a b c', 1)).toStrictEqual(['a'])
	expect(firstWords('a b c', 2)).toStrictEqual(['a', 'b'])
	expect(firstWords('a b c', 4)).toStrictEqual(['a', 'b', 'c'])
})

it('gets unique elements', () => {
	expect(unique([1, 2, 3, 3, 4, 5, 4])).toStrictEqual([1, 2, 3, 4, 5])
	expect(unique([1, 1, 1, 2, 1, 2])).toStrictEqual([1, 2])
	expect(unique([])).toStrictEqual([])
})

it('zero fills left', () => {
	expect(zeroFillLeft([1, 2, 3], 5)).toStrictEqual([0, 0, 1, 2, 3])
	expect(zeroFillLeft([1, 2, 3], 2)).toStrictEqual([2, 3])
	expect(zeroFillLeft([], 2)).toStrictEqual([0, 0])
})
