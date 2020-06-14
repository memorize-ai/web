import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import AuthButton from './AuthButton'
import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Logo, { LogoType } from '../shared/Logo'

import '../../scss/components/Home/Footer.scss'

const HomeFooter = () => (
	<footer className="footer">
		<div className="background" />
		<div className="content">
			<div className="top">
				<h1
					className="text"
					data-aos="fade-right"
				>
					The ultimate<br />
					memorization tool
				</h1>
				<AuthButton />
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
				<AppStoreDownloadButton className="download-app" />
				<p className="copyright">
					Copyright &copy; 2020 <b>memorize.ai Inc</b>.
					All rights reserved.
				</p>
			</div>
		</div>
	</footer>
)

export default memo(HomeFooter)
