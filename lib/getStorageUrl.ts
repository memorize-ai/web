const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
if (!storageBucket) throw new Error('Missing Firebase storage bucket')

const getStorageUrl = (pathComponents: string[], token?: string) =>
	`https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${pathComponents.join(
		'%2F'
	)}?alt=media${token ? `&token=${token}` : ''}`

export default getStorageUrl
