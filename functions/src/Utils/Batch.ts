import * as admin from 'firebase-admin'
import * as _ from 'lodash'

const firestore = admin.firestore()

export enum BatchOperationType {
	Create,
	Set,
	Update,
	Delete
}

export interface BatchOperationValue {
	ref: FirebaseFirestore.DocumentReference
	data: FirebaseFirestore.DocumentData | null
}

export interface BatchOperation {
	type: BatchOperationType
	value: BatchOperationValue
}

export default class Batch {
	private static MAX_CHUNK_SIZE = 500
	
	private operations: BatchOperation[]
	
	constructor(operations: BatchOperation[] = []) {
		this.operations = operations
	}
	
	private addOperation = (type: BatchOperationType, value: BatchOperationValue) => (
		this.operations.push({ type, value }),
		this
	)
	
	create = (ref: FirebaseFirestore.DocumentReference, data: FirebaseFirestore.DocumentData) =>
		this.addOperation(BatchOperationType.Create, { ref, data })
	
	set = (ref: FirebaseFirestore.DocumentReference, data: FirebaseFirestore.DocumentData) =>
		this.addOperation(BatchOperationType.Set, { ref, data })
	
	update = (ref: FirebaseFirestore.DocumentReference, data: FirebaseFirestore.DocumentData) =>
		this.addOperation(BatchOperationType.Update, { ref, data })
	
	delete = (ref: FirebaseFirestore.DocumentReference) =>
		this.addOperation(BatchOperationType.Delete, { ref, data: null })
	
	private addOperationToBatch = ({ type, value }: BatchOperation, batch: FirebaseFirestore.WriteBatch) => {
		switch (type) {
			case BatchOperationType.Create:
				return batch.create(value.ref, value.data ?? {})
			case BatchOperationType.Set:
				return batch.set(value.ref, value.data ?? {})
			case BatchOperationType.Update:
				return batch.update(value.ref, value.data ?? {})
			case BatchOperationType.Delete:
				return batch.delete(value.ref)
		}
	}
	
	commit = async () => {
		for (const operations of _.chunk(this.operations, Batch.MAX_CHUNK_SIZE)) {
			const batch = firestore.batch()
			
			for (const operation of operations)
				this.addOperationToBatch(operation, batch)
			
			await batch.commit()
		}
	}
}
