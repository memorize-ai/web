import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { ScreenshotType } from '../../shared/Screenshot'
import useKeyPress from '../../../hooks/useKeyPress'
import { sleep } from '../../../utils'

export const ANIMATION_DURATION = 400
export const TRANSFORM_LENGTH = 20

export const SCREENSHOTS = [
	{
		type: ScreenshotType.Review,
		title: <>No more <b>long<br />study sessions</b></>
	},
	{
		type: ScreenshotType.Cram,
		title: <><b>No time?</b><br />No problem.</>
	},
	{
		type: ScreenshotType.Editor,
		title: <>Advanced editor<br />with <b>math, images,<br />tables, and code</b></>
	},
	{
		type: ScreenshotType.Decks,
		title: <>Know what you<br /><b>need to review</b></>
	},
	{
		type: ScreenshotType.Market,
		title: <>Everything you<br />need to learn.<br /><b>Search no further</b>.</>
	},
	{
		type: ScreenshotType.Home,
		title: <>Summary<br /><b>at a glance</b></>
	},
	{
		type: ScreenshotType.Recap,
		title: <>Make learning<br /><b>a game</b></>
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
