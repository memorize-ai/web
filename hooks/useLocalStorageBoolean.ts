import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

const useLocalStorageBoolean = (key: string) => {
	const [isOn, setIsOn] = useState(false)

	useEffect(() => {
		try {
			setIsOn(localStorage.getItem(key) !== null)
		} catch ({ message }) {
			toast.error(message)
		}
	}, [setIsOn])

	return [
		isOn,
		useCallback(
			(isOn: boolean) => {
				setIsOn(isOn)

				try {
					isOn ? localStorage.setItem(key, '1') : localStorage.removeItem(key)
				} catch ({ message }) {
					toast.error(message)
				}
			},
			[key, setIsOn]
		)
	] as const
}

export default useLocalStorageBoolean
