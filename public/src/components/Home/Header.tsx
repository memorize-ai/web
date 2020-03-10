import React from 'react'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'

export default () => (
	<div className="home header flex">
		<div className="left flex flex-col text-white">
			<h1>
				The ultimate<br />
				memorization app
			</h1>
			<h3>Truly effective flashcards</h3>
			<p className="description text-dark-gray">
				Our AI-powered spaced repetition algorithm learns as you learn.
				Spend the least amount of time reviewing, but memorization has never been easier!
			</p>
			<div className="app-store-download-button-container flex">
				<AppStoreDownloadButton
					className="app-store-download-button shadow-raise-on-hover"
				/>
			</div>
		</div>
		<Screenshot type={ScreenshotType.Cram} className="screenshot hidden ml-auto" />
	</div>
)
