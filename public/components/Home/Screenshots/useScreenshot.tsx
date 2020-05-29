import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { ScreenshotType } from 'components/shared/Screenshot'
import useKeyPress from 'hooks/useKeyPress'
import { sleep } from 'lib/utils'

export const ANIMATION_DURATION = 400
export const TRANSFORM_LENGTH = 20

export const SCREENSHOTS = [
	{
		type: ScreenshotType.Home,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 1
			</>
		)
	},
	{
		type: ScreenshotType.Cram,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 2
			</>
		)
	},
	{
		type: ScreenshotType.Home,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 3
			</>
		)
	},
	{
		type: ScreenshotType.Home,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 4
			</>
		)
	},
	{
		type: ScreenshotType.Home,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 5
			</>
		)
	},
	{
		type: ScreenshotType.Home,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 6
			</>
		)
	},
	{
		type: ScreenshotType.Home,
		title: (
			<>
				Revolutionary<br />
				<strong>spaced repetition</strong><br />
				algorithm 7
			</>
		)
	}
]

export default () => {
	const [index, setIndex] = useState(0)
	const [className, setClassName] = useState(
		undefined as 'left' | 'right' | undefined
	)
	
	const shouldGoLeft = useKeyPress(37) // Left arrow
	const shouldGoRight = useKeyPress(39) // Right arrow
	
	const goLeft = useCallback(async () => {
		setClassName('left')
		
		await sleep(ANIMATION_DURATION / 2)
		
		setIndex(index =>
			index === 0
				? SCREENSHOTS.length - 1
				: index - 1
		)
		
		await sleep(ANIMATION_DURATION / 2)
		
		setClassName(undefined)
	}, [setClassName, setIndex])
	
	const goRight = useCallback(async () => {
		setClassName('right')
		
		await sleep(ANIMATION_DURATION / 2)
		
		setIndex(index =>
			index === SCREENSHOTS.length - 1
				? 0
				: index + 1
		)
		
		await sleep(ANIMATION_DURATION / 2)
		
		setClassName(undefined)
	}, [setClassName, setIndex])
	
	useEffect(() => {
		if (shouldGoLeft)
			goLeft()
	}, [shouldGoLeft, goLeft])
	
	useEffect(() => {
		if (shouldGoRight)
			goRight()
	}, [shouldGoRight, goRight])
	
	return {
		screenshots: SCREENSHOTS,
		index,
		setIndex: useCallback(async (newIndex: number) => {
			if (newIndex === index)
				return
			
			setClassName(newIndex > index ? 'right' : 'left')
			
			await sleep(ANIMATION_DURATION / 2)
			
			setIndex(newIndex)
			
			await sleep(ANIMATION_DURATION / 2)
			
			setClassName(undefined)
		}, [index, setClassName, setIndex]),
		screenshot: useMemo(() => SCREENSHOTS[index], [index]),
		className,
		goLeft,
		goRight
	}
}
