import React, { memo } from 'react'
import Helmet from 'react-helmet'
import cx from 'classnames'

import useScreenshot, { SCREENSHOTS } from './useScreenshot'
import Screenshot, { urlForScreenshot } from '../../shared/Screenshot'

import { ReactComponent as ScreenshotBackground } from '../../../images/home/screenshot-background.svg'
import { ReactComponent as LeftArrow } from '../../../images/icons/left-arrow.svg'

import '../../../scss/components/Home/Screenshots.scss'

const HomeScreenshots = () => {
	const {
		screenshots,
		index,
		setIndex,
		screenshot: { type, title },
		className,
		goLeft,
		goRight
	} = useScreenshot()
	
	return (
		<div
			id="screenshots"
			className={cx('screenshots', className)}
		>
			<Helmet>
				{SCREENSHOTS.slice(1).map(({ type }) => (
					<link
						key={type}
						rel="preload"
						href={urlForScreenshot(type)}
						as="image"
						type="image/webp"
					/>
				))}
			</Helmet>
			<div className="background" />
			<div className="content">
				<h2 className="title">{title}</h2>
				<div className="screenshot">
					<ScreenshotBackground className="background" />
					<Screenshot className="foreground" type={type} />
				</div>
				<div className="info">
					<h2 className="title">
						{title}
					</h2>
					<div className="navigation">
						<button onClick={goLeft}>
							<LeftArrow />
						</button>
						<button onClick={goRight}>
							<LeftArrow />
						</button>
					</div>
					<div className="gallery">
						{screenshots.map((_, i) => (
							<button
								key={i}
								className={cx({ selected: index === i })}
								onClick={() => setIndex(i)}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(HomeScreenshots)
