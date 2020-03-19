import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

import Logo, { LogoType } from './Logo'
import AppStoreDownloadButton from './AppStoreDownloadButton'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="navbar flex items-center">
		<Link to="/">
			<Logo type={LogoType.Capital} className="capital-logo raise-on-hover" />
		</Link>
		<div className="items flex items-center ml-auto">
			{children}
		</div>
		<AppStoreDownloadButton className="app-store-download-button hidden" />
	</div>
)
