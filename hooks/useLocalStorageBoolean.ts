import { useState, useCallback, useEffect } from 'react'

import handleError from 'lib/handleError'

const useLocalStorageBoolean = (key: string) => {
	const [isOn, setIsOn] = useState(false)

	useEffect(() => {
		try {
			setIsOn(localStorage.getItem(key) !== null)
		} catch (error) {
			handleError(error)
		}
	}, [setIsOn])

	return [
		isOn,
		useCallback(
			(isOn: boolean) => {
				setIsOn(isOn)

				try {
					isOn ? localStorage.setItem(key, '1') : localStorage.removeItem(key)
				} catch (error) {
					handleError(error)
				}
			},
			[key, setIsOn]
		)
	] as const
}

export default useLocalStorageBoolean
