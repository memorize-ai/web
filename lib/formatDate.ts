const YEAR = new Intl.DateTimeFormat('en-US', { year: 'numeric' })
const MONTH = new Intl.DateTimeFormat('en-US', { month: 'short' })
const DAY = new Intl.DateTimeFormat('en-US', { day: 'numeric' })

const formatDate = (date: Date) =>
	`${MONTH.format(date)} ${DAY.format(date)}, ${YEAR.format(date)}`

export default formatDate
