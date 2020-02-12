import { DEFAULT_STORAGE_BUCKET } from '../constants'

export const storageUrl = (pathComponents: string[], token: string) =>
	`https://firebasestorage.googleapis.com/v0/b/${DEFAULT_STORAGE_BUCKET}/o/${pathComponents.join('%2F')}?alt=media&token=${token}`
