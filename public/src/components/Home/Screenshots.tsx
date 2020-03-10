import React from 'react'

import Screenshot, { ScreenshotType } from '../shared/Screenshot'

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
		<div className="content relative">
			{screenshots.map((type, index) => (
				<div key={index}>
					<div
						id={`home-screenshots-aos-anchor-${index}`}
						className="anchor absolute inset-x-0"
						style={{ top: `${index * 100}vh` }}
					/>
					<div className="fixed-container fixed inset-0 pointer-events-none">
						<div className="center-container grid justify-center content-center h-screen">
							<Screenshot
								type={type}
								className="screenshot"
								data-aos="fade-right"
								data-aos-anchor={`#home-screenshots-aos-anchor-${index}`}
								data-aos-anchor-placement="top-top"
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	</div>
)
