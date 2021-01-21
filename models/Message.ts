export default class Message {
	id: string
	from: string
	to: string
	body: string

	constructor(snapshot: FirebaseFirestore.DocumentSnapshot) {
		this.id = snapshot.id
		this.from = snapshot.get('from')
		this.to = snapshot.get('to')
		this.body = snapshot.get('body')
	}
}
