import React from 'react'

import FixedContainer from './ScreenshotsFixedContainer'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'
import backgroundImage from '../../images/home-screenshots-background.png'

const screenshots = [
	ScreenshotType.Cram,
	ScreenshotType.Cram,
	ScreenshotType.Cram,
	ScreenshotType.Cram,
	ScreenshotType.Cram
]

export default () => (
	<div className="home screenshots stack">
		<div className="background origin-top-right" />
		<div
			id="home-screenshots-aos-anchor"
			className="content relative"
		>
			<FixedContainer outerClassName="background" anchor="#home-screenshots-aos-anchor">
				<img className="background" src={backgroundImage} alt="Background" />
			</FixedContainer>
			<div className="screenshots">
				{screenshots.map((type, index) => (
					<div key={index}>
						<div
							id={`home-screenshots-aos-anchor-${index}`}
							className="anchor absolute inset-x-0"
							style={{ top: `${index * 60}vh` }}
						/>
						<FixedContainer anchor={`#home-screenshots-aos-anchor-${index}`}>
							<Screenshot type={type} className="screenshot" />
						</FixedContainer>
					</div>
				))}
			</div>
		</div>
	</div>
)
