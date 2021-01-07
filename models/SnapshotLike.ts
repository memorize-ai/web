export default interface SnapshotLike {
	id: string
	get(path: string): any // eslint-disable-line
	data(): any // eslint-disable-line
}
