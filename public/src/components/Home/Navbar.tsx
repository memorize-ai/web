import React from 'react'
import { Link } from 'react-router-dom'

import Logo, { LogoType } from '../shared/Logo'
import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'

export default () => (
	<div className="home navbar flex items-center">
		<Link to="/">
			<Logo type={LogoType.Capital} className="capital-logo raise-on-hover" />
		</Link>
		<AppStoreDownloadButton className="app-store-download-button hidden ml-auto" />
	</div>
)
