import React from 'react'
import { Link } from 'react-router-dom'

import CapitalLogo from '../shared/CapitalLogo'
import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'

export default () => (
	<div className="navbar flex items-center">
		<Link to="/">
			<CapitalLogo className="capital-logo raise-on-hover" />
		</Link>
		<AppStoreDownloadButton className="hidden sm:block ml-auto shadow-raise-on-hover" />
	</div>
)
