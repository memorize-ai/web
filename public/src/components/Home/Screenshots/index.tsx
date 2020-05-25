import React from 'react'
import cx from 'classnames'

import useScreenshot from './useScreenshot'
import Screenshot from '../../shared/Screenshot'

import screenshotBackground from '../../../images/home/screenshot-background.webp'
import { ReactComponent as LeftArrow } from '../../../images/icons/left-arrow.svg'

import '../../../scss/components/Home/Screenshots.scss'

export default () => {
	const {
		setIndex,
		screenshot: { type, title },
		className,
		goLeft,
		goRight
	} = useScreenshot()
	
	return (
		<div className={cx('screenshots', className)}>
			<div className="background" />
			<div className="content">
				<div className="screenshot">
					<img src={screenshotBackground} alt="Background" />
					<Screenshot type={type} />
				</div>
				<div className="info">
					<h2 className="title">{title}</h2>
					<div className="navigation">
						<button onClick={goLeft}>
							<LeftArrow />
						</button>
						<button onClick={goRight}>
							<LeftArrow />
						</button>
					</div>
					<div className="gallery">
						
					</div>
				</div>
			</div>
		</div>
	)
}
