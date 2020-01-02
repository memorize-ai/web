import { NeuralNetwork } from 'brain.js'

import { flatten, firstWords, unique, zeroFillLeft } from '../Helpers'
import CardTrainingData from './CardTrainingData'

const HISTORY_COUNT = 10
const FIRST_WORDS_COUNT = 2
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24

export default class Algorithm {
	static INITIAL_INTERVAL = 1000 * 60 * 60 * 4
	
	static nextDueDate = (id: string, trainingData: CardTrainingData[]): Date => {
		const wordsArray = unique(flatten(trainingData.map(({ card }) =>
			firstWords(card.front, FIRST_WORDS_COUNT)
		)))
		const inputSize = HISTORY_COUNT + wordsArray.length
		const net = new NeuralNetwork
		net.train(formatTrainingData(trainingData, wordsArray), {
			errorThresh: 0.0001,
			inputSize,
			outputSize: 1,
			hiddenLayers: [inputSize, inputSize],
			activation: 'tanh'
		} as INeuralNetworkTrainingOptions)
		const current = trainingData.find(({ card }) => card.id === id)
		return current
			? new Date(denormalize(net.run([
				...zeroFillLeft(normalize(current.intervals), HISTORY_COUNT),
				...multiHot(firstWords(current.card.front, FIRST_WORDS_COUNT), wordsArray)
			]))[0])
			: new Date
	}
}

interface INeuralNetworkTrainingOptions {
	errorThresh: number
	inputSize: number
	outputSize: number
	hiddenLayers: number[]
	activation: string
}

const multiHot = (words: string[], wordsArray: string[]): (0 | 1)[] =>
	wordsArray.map(word => words.includes(word) ? 1 : 0)

const formatInputTrainingData = ({ card, intervals }: CardTrainingData, words: string[]): number[] => [
	...zeroFillLeft(normalize(intervals.slice(0, -1)), HISTORY_COUNT),
	...multiHot(firstWords(card.front, FIRST_WORDS_COUNT), words)
]

const normalize = (values: number[]): number[] =>
	values.map(value => value / MILLISECONDS_IN_DAY)

const denormalize = (values: number[]): number[] =>
	values.map(value => value * MILLISECONDS_IN_DAY)

const formatTrainingData = (trainingData: CardTrainingData[], words: string[]): { input: number[], output: number[] }[] =>
	trainingData.map(data => ({
		input: formatInputTrainingData(data, words),
		output: normalize(data.intervals.slice(-1))
	}))
