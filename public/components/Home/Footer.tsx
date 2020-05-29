import React from 'react'

import AppStoreDownloadButton from 'components/shared/AppStoreDownloadButton'
import Logo, { LogoType } from 'components/shared/Logo'

import styles from 'styles/components/Home/Footer.module.scss'

export default () => (
	<footer className="footer">
		<div className="background" />
		<div className="content">
			<div className="top">
				<h1 className="text">
					Download the ultimate<br />
					memorization app
				</h1>
				<AppStoreDownloadButton />
			</div>
			<div className="bottom">
				<Logo type={LogoType.Capital} />
				<p>
					Copyright &copy; 2020 <b>memorize.ai Inc</b>.
					All rights reserved
				</p>
			</div>
		</div>
	</footer>
)
