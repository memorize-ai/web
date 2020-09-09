import type { MemorizeErrorStatus } from '../types'

export default class MemorizeError extends Error {
	constructor(
		public status: MemorizeErrorStatus,
		public message: string
	) {
		super(message)
	}
}
