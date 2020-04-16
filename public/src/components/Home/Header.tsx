import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobile } from '@fortawesome/free-solid-svg-icons'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'

import '../../scss/components/Home/Header.scss'

export default () => (
	<div className="home header">
		<div className="left">
			<h1>
				Do less.<br />
				Learn more.
			</h1>
			<h3>Truly effective flashcards</h3>
			<div className="footer">
				<AppStoreDownloadButton className="app-store-download-button" />
				<a href="#screenshots" className="screenshots-button">
					<FontAwesomeIcon icon={faMobile} />
					<p>Screenshots</p>
				</a>
			</div>
		</div>
		<Screenshot type={ScreenshotType.Cram} className="screenshot" />
	</div>
)
