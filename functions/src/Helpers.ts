export function getDate(snapshot: FirebaseFirestore.DocumentSnapshot, field: string): Date | undefined {
	const timestamp: FirebaseFirestore.Timestamp | undefined = snapshot.get(field)
	return timestamp ? timestamp.toDate() : undefined
}