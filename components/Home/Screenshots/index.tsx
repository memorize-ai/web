import Head from 'next/head'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import useScreenshot, { SCREENSHOTS } from './useScreenshot'
import Screenshot, { screenshotSrc } from 'components/Screenshot'

import screenshotBackground from 'images/home/screenshot-background.svg'
import leftArrow from 'images/icons/left-arrow.svg'

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
		<div id="screenshots" className={cx('screenshots', className)}>
			<Head>
				{SCREENSHOTS.slice(1).map(({ type }) => (
					<link
						key={type}
						rel="prefetch"
						href={screenshotSrc(type).src}
						as="image"
						type="image/webp"
					/>
				))}
			</Head>
			<div className="background" />
			<div className="content">
				<h2 className="title">{title}</h2>
				<div className="screenshot">
					<Svg
						className="background"
						src={screenshotBackground}
						viewBox={`0 0 ${screenshotBackground.width} ${screenshotBackground.height}`}
					/>
					<Screenshot className="foreground" type={type} />
				</div>
				<div className="info">
					<h2 className="title">{title}</h2>
					<div className="navigation">
						<button onClick={goLeft}>
							<Svg src={leftArrow} />
						</button>
						<button onClick={goRight}>
							<Svg src={leftArrow} />
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

export default HomeScreenshots
