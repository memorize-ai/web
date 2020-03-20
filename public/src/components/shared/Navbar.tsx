import React, { HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

import Logo, { LogoType } from './Logo'
import AppStoreDownloadButton from './AppStoreDownloadButton'

import '../../scss/components/Navbar.scss'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="navbar">
		<Link to="/">
			<Logo type={LogoType.Capital} className="logo" />
		</Link>
		<div className="items">{children}</div>
		<AppStoreDownloadButton className="app-store-download-button" />
	</div>
)
