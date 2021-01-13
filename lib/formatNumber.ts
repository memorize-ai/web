import toOneDecimalPlace from './toOneDecimalPlace'

const formatNumber = (number: number) => {
	const logResult = Math.log10(Math.abs(number))

	const decimalResult = toOneDecimalPlace(
		number / Math.pow(10, Math.min(3, Math.floor(logResult)))
	)

	const formattedDecimalResult = (Number.isInteger(decimalResult)
		? Math.floor(decimalResult)
		: decimalResult
	).toString()

	if (logResult < 3)
		return (Number.isInteger(number)
			? Math.floor(number)
			: toOneDecimalPlace(number)
		).toString()

	if (logResult < 6) return `${formattedDecimalResult}k`

	if (logResult < 9) return `${formattedDecimalResult}m`

	if (logResult < 12) return `${formattedDecimalResult}b`

	return 'overflow'
}

export const formatNumberAsInt = (number: number) =>
	Math.abs(number) < 1000 ? Math.floor(number).toString() : formatNumber(number)

export default formatNumber
