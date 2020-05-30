import React from 'react'
import { Link } from 'react-router-dom'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Logo, { LogoType } from '../shared/Logo'

import '../../scss/components/Home/Footer.scss'

export default () => (
	<footer className="footer">
		<div className="background" />
		<div className="content">
			<div className="top">
				<h1 className="text">
					Download the ultimate<br />
					memorization app
				</h1>
				<AppStoreDownloadButton className="button" />
			</div>
			<div className="bottom">
				<Link to="/" className="logo">
					<Logo type={LogoType.Capital} />
				</Link>
				<div className="socials">
					<a
						href="mailto:support@memorize.ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Contact us
					</a>
					<div className="divider" />
					<a
						href="https://twitter.com/memorize_ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Twitter
					</a>
					<div className="divider" />
					<a
						href="https://twitter.com/fact_a_minute"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						fact_a_minute
					</a>
				</div>
				<p className="copyright">
					Copyright &copy; 2020 <b>memorize.ai Inc</b>.
					All rights reserved.
				</p>
			</div>
		</div>
	</footer>
)
