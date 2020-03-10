import React from 'react'
import { Link } from 'react-router-dom'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Logo, { LogoType } from '../shared/Logo'

export default () => (
	<div className="home footer text-dark-gray bg-medium-gray">
		<div className="top flex justify-center items-center">
			<h1 className="hidden mr-auto">
				Download the ultimate memorization app
			</h1>
			<AppStoreDownloadButton
				className="app-store-download-button ml-auto"
			/>
		</div>
		<hr className="bg-black" />
		<div className="bottom flex flex-col items-center">
			<Link to="/">
				<Logo
					type={LogoType.CapitalInvertedGrayscale}
					className="logo raise-on-hover"
				/>
			</Link>
			<p className="opacity-50">
				Copyright &copy; 2020 <b>memorize.ai Inc</b>.
				All rights reserved.
			</p>
		</div>
	</div>
)
