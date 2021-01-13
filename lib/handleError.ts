import { toast } from 'react-toastify'

export interface ErrorLike {
	message: string
}

const handleError = (error: ErrorLike | null | undefined) => {
	toast.error(error?.message ?? 'An unknown error occurred', {
		className: 'toast'
	})
	console.error(error)
}

export default handleError
