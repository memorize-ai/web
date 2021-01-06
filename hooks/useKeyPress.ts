import { useState, useEffect } from 'react'

const useKeyPress = (keys: string[]) => {
	const [isPressed, setIsPressed] = useState(false)
	
	useEffect(() => {
		const keyDown = ({ key }: KeyboardEvent) =>
			keys.includes(key) && setIsPressed(true)
		
		const keyUp = ({ key }: KeyboardEvent) =>
			keys.includes(key) && setIsPressed(false)
		
		window.addEventListener('keydown', keyDown)
		window.addEventListener('keyup', keyUp)
		
		return () => {
			window.removeEventListener('keydown', keyDown)
			window.removeEventListener('keyup', keyUp)
		}
	}, [keys])
	
	return isPressed
}

export default useKeyPress
