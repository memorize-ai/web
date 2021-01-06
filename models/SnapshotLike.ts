export default interface SnapshotLike {
	id: string
	get(path: string): any
	data(): any
}
