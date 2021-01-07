const getStorageUrl = (pathComponents: string[], token?: string) =>
	`https://firebasestorage.googleapis.com/v0/b/${
		process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
	}/o/${
		pathComponents.join('%2F')
	}?alt=media${
		token ? `&token=${token}` : ''
	}`

export default getStorageUrl
