import React from 'react'
import { Link } from 'react-router-dom'

import Logo, { LogoType } from './Logo'
import AppStoreDownloadButton from './AppStoreDownloadButton'

export default () => (
	<div className="basic navbar flex items-center">
		<Link to="/">
			<Logo type={LogoType.Capital} className="capital-logo raise-on-hover" />
		</Link>
		<AppStoreDownloadButton className="app-store-download-button hidden ml-auto" />
	</div>
)
