import React from 'react'
import { Link } from 'react-router-dom'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Logo, { LogoType } from '../shared/Logo'

import '../../scss/components/Home/Footer.scss'

export default () => (
	<div className="home footer">
		<div className="top">
			<h1>Download the ultimate memorization app</h1>
			<AppStoreDownloadButton
				className="app-store-download-button"
			/>
		</div>
		<hr />
		<div className="bottom">
			<Link to="/">
				<Logo
					type={LogoType.CapitalInvertedGrayscale}
					className="logo"
				/>
			</Link>
			<p>
				Copyright &copy; 2020 <b>memorize.ai Inc</b>.
				All rights reserved.
			</p>
		</div>
	</div>
)
