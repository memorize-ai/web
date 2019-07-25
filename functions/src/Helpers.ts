export function getDate(snapshot: FirebaseFirestore.DocumentSnapshot, field: string): Date | undefined {
	const timestamp: FirebaseFirestore.Timestamp | undefined = snapshot.get(field)
	return timestamp ? timestamp.toDate() : undefined
}

export function flatten(array: any[], depth: number): any[] {
	return array.reduce((acc, element) =>
		acc.concat(Array.isArray(element) && depth > 1 ? flatten(element, depth - 1) : element)
	, [])
}

export function getQueryParameter(query: any, parameter: string, encode: boolean = false): string | undefined {
	const value: string | undefined = query[parameter]
	return value
		? encode
			? encodeURIComponent(value).replace(/\./g, '%2E')
			: value
		: undefined
}

export function getQueryParameterJSON(query: any, parameter: string): object | undefined {
	const value = getQueryParameter(query, parameter)
	return value ? JSON.parse(value) : undefined
}