import React from 'react'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Logo, { LogoType } from '../shared/Logo'

export default () => (
	<div className="home footer text-dark-gray bg-medium-gray">
		<div className="top flex items-center justify-center">
			<h1>Download the ultimate memorization app</h1>
			<AppStoreDownloadButton className="app-store-download-button" />
		</div>
		<hr className="bg-black" />
		<div className="bottom flex flex-col items-center">
			<Logo
				type={LogoType.CapitalInvertedGrayscale}
				className="logo raise-on-hover"
			/>
			<p className="opacity-50">
				Copyright &copy; 2020 <b>memorize.ai Inc</b>.
				All rights reserved.
			</p>
		</div>
	</div>
)
