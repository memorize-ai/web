import React, { HTMLAttributes } from 'react'

export enum ScreenshotType {
	Cram = 'cram.png',
	Market = 'market.png'
}

export default ({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => (
	<img {...props} src={require(`../../images/screenshots/${type}`)} alt="Screenshot" />
)
