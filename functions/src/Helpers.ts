export function getDate(snapshot: FirebaseFirestore.DocumentSnapshot, field: string): Date | undefined {
	const timestamp: FirebaseFirestore.Timestamp | undefined = snapshot.get(field)
	return timestamp ? timestamp.toDate() : undefined
}

export function flatten(array: any[], depth: number): any[] {
	return array.reduce((acc, element) =>
		acc.concat(Array.isArray(element) && depth > 1 ? flatten(element, depth - 1) : element)
	, [])
}