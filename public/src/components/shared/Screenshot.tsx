import React, { HTMLAttributes } from 'react'

export enum ScreenshotType {
	Cram = 'cram.webp',
	Decks = 'decks.webp',
	Editor = 'editor.webp',
	Home = 'home.webp',
	Market = 'market.webp',
	Recap = 'recap.webp',
	Review = 'review.webp'
}

export default ({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/screenshots/${type}`)} alt="Screenshot" />
)
