import { NeuralNetwork } from 'brain.js'

const HISTORY_COUNT = 10
const MILLISECONDS_IN_DAY = 86400000

export default class Algorithm {
	static predict(id: string, cards: { id: string, intervals: number[], front: string }[]): Date {
		const wordsArray = unique(cards.flatMap(card => firstWords(card.front)))
		const inputSize = HISTORY_COUNT + wordsArray.length
		const net = new NeuralNetwork()
		net.train(formatTrainingData(cards, wordsArray), trainingOptions(0.0001, inputSize, 1, [inputSize, inputSize], 'tanh'))
		const current = cards.find(card => card.id === id)
		return new Date(current ? denormalize(net.run(zeroFillLast(normalize(current.intervals), HISTORY_COUNT).concat(multiHot(firstWords(current.front), wordsArray))))[0] : 0)
	}
}

function firstWords(sentence: string): string[] {
	return sentence.split(/\W/).filter(a => a.length).slice(0, 2)
}

function unique(words: string[]): string[] {
	return Array.from(new Set(words))
}

function zeroFillLast<T>(arr: T[], count: number): T[] {
	const last = arr.slice(-count)
	return last.length === count ? last : Array(count - last.length).fill(0).concat(last)
}

function multiHot(words: string[], wordsArray: string[]): number[] {
	return wordsArray.map(word => words.includes(word) ? 1 : 0)
}

function formatInputTrainingData(card: { id: string, intervals: number[], front: string }, words: string[]): number[] {
	return zeroFillLast(normalize(card.intervals.slice(0, -1)), HISTORY_COUNT).concat(multiHot(firstWords(card.front), words))
}

function normalize(vals: number[]): number[] {
	return vals.map(val => val / MILLISECONDS_IN_DAY)
}

function denormalize(vals: number[]): number[] {
	return vals.map(val => val * MILLISECONDS_IN_DAY)
}

function formatTrainingData(cards: { id: string, intervals: number[], front: string }[], words: string[]): { input: number[], output: number[] }[] {
	return cards.map(card => ({ input: formatInputTrainingData(card, words), output: normalize(card.intervals.slice(-1)) }))
}

interface INeuralNetworkTrainingOptions {
	errorThresh: number
	inputSize: number
	outputSize: number
	hiddenLayers: number[]
	activation: string
}

function trainingOptions(errorThresh: number, inputSize: number, outputSize: number, hiddenLayers: number[], activation: string): INeuralNetworkTrainingOptions {
	return { errorThresh, inputSize, outputSize, hiddenLayers, activation }
}