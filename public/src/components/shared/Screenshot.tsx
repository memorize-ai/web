import React, { HTMLAttributes } from 'react'

export enum ScreenshotType {
	Cram = 'cram.png',
	Decks = 'decks.png',
	Editor = 'editor.png',
	Home = 'home.png',
	Market = 'market.png',
	Recap = 'recap.png',
	Review = 'review.png'
}

export default ({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/screenshots/${type}`)} alt="Screenshot" />
)
