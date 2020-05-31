import React, { HTMLAttributes, memo } from 'react'

export enum ScreenshotType {
	Cram = 'cram.webp',
	Decks = 'decks.webp',
	Editor = 'editor.webp',
	Home = 'home.webp',
	Market = 'market.webp',
	Recap = 'recap.webp',
	Review = 'review.webp'
}

const Screenshot = memo(({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/screenshots/${type}`)} alt="Screenshot" />
))

export default Screenshot
