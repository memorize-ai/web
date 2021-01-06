import { HTMLAttributes } from 'react'
import Image from 'react-optimized-image'

import cram from 'images/screenshots/cram.jpg'
import sections from 'images/screenshots/sections.jpg'
import editor from 'images/screenshots/editor.jpg'
import home from 'images/screenshots/home.jpg'
import market from 'images/screenshots/market.jpg'
import recap from 'images/screenshots/recap.jpg'
import review from 'images/screenshots/review.jpg'

export enum ScreenshotType {
	Cram,
	Sections,
	Editor,
	Home,
	Market,
	Recap,
	Review
}

export const screenshotSrc = (type: ScreenshotType) => {
	switch (type) {
		case ScreenshotType.Cram: return cram
		case ScreenshotType.Sections: return sections
		case ScreenshotType.Editor: return editor
		case ScreenshotType.Home: return home
		case ScreenshotType.Market: return market
		case ScreenshotType.Recap: return recap
		case ScreenshotType.Review: return review
	}
}

const Screenshot = ({ type, ...props }: { type: ScreenshotType } & HTMLAttributes<HTMLImageElement>) => {
	switch (type) {
		case ScreenshotType.Cram: return <Image {...props} src={cram} alt="Screenshot" webp />
		case ScreenshotType.Sections: return <Image {...props} src={sections} alt="Screenshot" webp />
		case ScreenshotType.Editor: return <Image {...props} src={editor} alt="Screenshot" webp />
		case ScreenshotType.Home: return <Image {...props} src={home} alt="Screenshot" webp />
		case ScreenshotType.Market: return <Image {...props} src={market} alt="Screenshot" webp />
		case ScreenshotType.Recap: return <Image {...props} src={recap} alt="Screenshot" webp />
		case ScreenshotType.Review: return <Image {...props} src={review} alt="Screenshot" webp />
	}
}

export default Screenshot
