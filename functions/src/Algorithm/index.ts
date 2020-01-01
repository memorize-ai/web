import { NeuralNetwork } from 'brain.js'

const HISTORY_COUNT = 10
const FIRST_WORDS_COUNT = 2
const MILLISECONDS_IN_DAY = 86400000

export type CardTrainingData = { id: string, intervals: number[], front: string }

export default class Algorithm {
	static predict(id: string, cards: CardTrainingData[]): Date {
		const wordsArray = unique(flatten(cards.map(card =>
			firstWords(card.front)
		)))
		const inputSize = HISTORY_COUNT + wordsArray.length
		const net = new NeuralNetwork
		net.train(formatTrainingData(cards, wordsArray), {
			errorThresh: 0.0001,
			inputSize,
			outputSize: 1,
			hiddenLayers: [inputSize, inputSize],
			activation: 'tanh'
		} as INeuralNetworkTrainingOptions)
		const current = cards.find(card => card.id === id)
		return new Date(
			current
				? denormalize(net.run([
					...zeroFillLeft(normalize(current.intervals), HISTORY_COUNT),
					...multiHot(firstWords(current.front), wordsArray)
				]))[0]
				: 0
		)
	}
}

interface INeuralNetworkTrainingOptions {
	errorThresh: number
	inputSize: number
	outputSize: number
	hiddenLayers: number[]
	activation: string
}

const flatten = <T>(array: T[][]): T[] =>
	[].concat(...array)

const firstWords = (sentence: string): string[] =>
	sentence.split(/\W/).filter(word => word.length).slice(0, FIRST_WORDS_COUNT)

const unique = (words: string[]): string[] =>
	[...new Set(words)]

const zeroFillLeft = <T>(array: T[], count: number): T[] => {
	const last = array.slice(-count)
	return last.length === count
		? last
		: [...Array(count - last.length).fill(0), ...last]
}

const multiHot = (words: string[], wordsArray: string[]): (0 | 1)[] =>
	wordsArray.map(word => words.includes(word) ? 1 : 0)

const formatInputTrainingData = (card: CardTrainingData, words: string[]): number[] => [
	...zeroFillLeft(normalize(card.intervals.slice(0, -1)), HISTORY_COUNT),
	...multiHot(firstWords(card.front), words)
]

const normalize = (values: number[]): number[] =>
	values.map(value => value / MILLISECONDS_IN_DAY)

const denormalize = (values: number[]): number[] =>
	values.map(value => value * MILLISECONDS_IN_DAY)

const formatTrainingData = (cards: CardTrainingData[], words: string[]): { input: number[], output: number[] }[] =>
	cards.map(card => ({
		input: formatInputTrainingData(card, words),
		output: normalize(card.intervals.slice(-1))
	}))
