export function getDate(snapshot: FirebaseFirestore.DocumentSnapshot, field: string): Date | undefined {
	const timestamp: FirebaseFirestore.Timestamp | undefined = snapshot.get(field)
	return timestamp ? timestamp.toDate() : undefined
}

export function flatten<T>(array: any[], depth?: number): T[] {
	return array.reduce((acc, element) =>
		acc.concat(
			Array.isArray(element) && (depth === undefined || depth > 1)
				? flatten<T>(element, depth === undefined ? undefined : depth - 1)
				: element
		)
	, [])
}

export function getQueryParameter(query: any, parameter: string, decode: boolean = true): string | undefined {
	const value: string | undefined = (query || {})[parameter]
	return value === undefined
		? undefined
		: decode
			? decodeURIComponent(value)
			: value
}

export function getQueryParameterJSON(query: any, parameter: string): object | undefined {
	const value = getQueryParameter(query, parameter)
	return value === undefined ? undefined : JSON.parse(value)
}