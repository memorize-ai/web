import { useState } from 'react'

export default (key: string) => {
	const [isOn, setIsOn] = useState(
		process.browser
			? localStorage.getItem(key) !== null
			: false
	)
	
	return [
		isOn,
		(isOn: boolean) => {
			setIsOn(isOn)
			
			if (!process.browser)
				return
			
			isOn
				? localStorage.setItem(key, '1')
				: localStorage.removeItem(key)
		}
	] as const
}
