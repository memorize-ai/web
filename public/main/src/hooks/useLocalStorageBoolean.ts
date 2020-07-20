import { useState, useCallback } from 'react'

export default (key: string) => {
	const [isOn, setIsOn] = useState(localStorage.getItem(key) !== null)
	
	return [
		isOn,
		useCallback((isOn: boolean) => {
			setIsOn(isOn)
			
			isOn
				? localStorage.setItem(key, '1')
				: localStorage.removeItem(key)
		}, [key, setIsOn])
	] as const
}
