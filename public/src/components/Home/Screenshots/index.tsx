import React, { memo } from 'react'
import cx from 'classnames'

import useScreenshot from './useScreenshot'
import Screenshot from '../../shared/Screenshot'

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
			<div className="background" />
			<div className="content">
				<h2 className="title">{title}</h2>
				<div className="screenshot">
					<ScreenshotBackground className="background" />
					<Screenshot
						className="foreground"
						type={type}
						data-aos="fade-up"
					/>
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
