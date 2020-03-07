import React from 'react'
import { Link } from 'react-router-dom'

import CapitalLogo from '../shared/CapitalLogo'
import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'

export default () => (
	<div className="navbar flex items-center">
		<Link to="/">
			<CapitalLogo />
		</Link>
		<AppStoreDownloadButton className="hidden sm:block ml-auto" />
	</div>
)
