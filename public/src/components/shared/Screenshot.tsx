import React, { HTMLAttributes, memo } from 'react'

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

const Screenshot = ({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => (
	<WebP
		{...props}
		src={require(`../../images/screenshots/${type}.webp`)}
		fallback={require(`../../images/fallbacks/screenshots/${type}.jpg`)}
		alt="Screenshot"
	/>
)

export default memo(Screenshot)
