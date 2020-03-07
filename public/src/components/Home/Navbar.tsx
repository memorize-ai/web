import React from 'react'

import CapitalLogo from '../shared/CapitalLogo'
import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'

export default () => (
	<div className="navbar flex items-center">
		<CapitalLogo />
		<AppStoreDownloadButton className="hidden sm:block ml-auto" />
	</div>
)
