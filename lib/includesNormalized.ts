const includesNormalized = (query: string, values: string[]) => {
	const normalizedQuery = query.replace(/\s+/g, '').toLowerCase()

	return values.some(value =>
		value.replace(/\s+/g, '').toLowerCase().includes(normalizedQuery)
	)
}

export default includesNormalized
