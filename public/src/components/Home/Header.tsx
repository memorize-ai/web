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
				Artificial Intelligence learns how to quiz you with the right flashcards at the right time.
				Spend little time reviewing and remember better than you thought possible.
			</p>
			<div className="app-store-download-button-container flex">
				<AppStoreDownloadButton className="app-store-download-button" />
			</div>
		</div>
		<Screenshot type={ScreenshotType.Cram} className="screenshot hidden ml-auto" />
	</div>
)
