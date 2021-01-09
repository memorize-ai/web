import Head from 'next/head'
import { Svg } from 'react-optimized-image'
import cx from 'classnames'

import useScreenshot, { UseScreenshotActions } from 'hooks/useScreenshot'
import Screenshot, { screenshotSrc } from 'components/Screenshot'

import screenshotBackground from 'images/home/screenshot-background.svg'
import leftArrow from 'images/icons/left-arrow.svg'
import styles from './index.module.scss'

const ACTIONS: UseScreenshotActions = {
	left: styles.action_left,
	right: styles.action_right
}

const HomeScreenshots = () => {
	const {
		screenshots,
		index,
		setIndex,
		screenshot: { type, title },
		className,
		goLeft,
		goRight
	} = useScreenshot(ACTIONS)

	return (
		<div id="screenshots" className={cx(styles.root, className)}>
			<Head>
				{screenshots.slice(1).map(({ type }) => (
					<link
						key={type}
						rel="prefetch"
						href={screenshotSrc(type).src}
						as="image"
						type="image/webp"
					/>
				))}
			</Head>
			<div className={styles.background} />
			<div className={styles.content}>
				<h2 className={styles.title}>{title}</h2>
				<div className={styles.screenshot}>
					<Svg
						className={styles.screenshotBackground}
						src={screenshotBackground}
						viewBox={`0 0 ${screenshotBackground.width} ${screenshotBackground.height}`}
					/>
					<Screenshot className={styles.screenshotForeground} type={type} />
				</div>
				<div className={styles.info}>
					<h2 className={styles.infoTitle} aria-hidden>
						{title}
					</h2>
					<div className={styles.navigation}>
						<button className={styles.navigationButton} onClick={goLeft}>
							<Svg className={styles.navigationButtonIcon} src={leftArrow} />
						</button>
						<button className={styles.navigationButton} onClick={goRight}>
							<Svg className={styles.navigationButtonIcon} src={leftArrow} />
						</button>
					</div>
					<div className={styles.gallery}>
						{screenshots.map((_, i) => (
							<button
								key={i}
								className={cx(styles.galleryButton, {
									[styles.selectedGalleryButton]: index === i
								})}
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
