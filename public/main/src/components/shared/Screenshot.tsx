import React, { HTMLAttributes } from 'react'

import WebP from './WebP'

export enum ScreenshotType {
	Cram = 'cram',
	Sections = 'sections',
	Editor = 'editor',
	Home = 'home',
	Market = 'market',
	Recap = 'recap',
	Review = 'review'
}

export const urlForScreenshot = (type: ScreenshotType): string =>
	require(`../../images/screenshots/${type}.webp`)

export const fallbackUrlForScreenshot = (type: ScreenshotType): string =>
	require(`../../images/fallbacks/screenshots/${type}.jpg`)

const Screenshot = ({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => (
	<WebP
		{...props}
		src={urlForScreenshot(type)}
		fallback={fallbackUrlForScreenshot(type)}
		alt="Screenshot"
	/>
)

export default Screenshot
