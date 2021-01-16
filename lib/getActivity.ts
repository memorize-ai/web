import ActivityNode, {
	ActivityNodeData,
	getBeforeFirstVisibleDay
} from 'models/ActivityNode'
import firebase from './firebase/admin'

const firestore = firebase.firestore()

const getActivity = async (id: string) => {
	const { docs } = await firestore
		.collection(`users/${id}/activity`)
		.where('day', '>', getBeforeFirstVisibleDay())
		.get()

	const nodes: Record<number, ActivityNodeData> = {}

	for (const snapshot of docs) {
		const node = ActivityNode.dataFromSnapshot(snapshot)
		nodes[node.day] = node
	}

	return nodes
}

export default getActivity
