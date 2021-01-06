import Link from 'next/link'
import Image from 'react-optimized-image'

import AuthButton from './AuthButton'
import AppStoreDownloadButton from 'components/AppStoreDownloadButton'
import { SLACK_INVITE_URL, API_URL } from 'lib/constants'

import logo from 'images/logos/capital.jpg'

const HomeFooter = () => (
	<footer className="footer">
		<div className="background" />
		<div className="content">
			<div className="top">
				<h1
					className="text"
					data-aos="fade-down"
				>
					The ultimate<br />
					memorization tool
				</h1>
				<AuthButton />
			</div>
			<div className="bottom">
				<Link href="/">
					<a className="logo">
						<Image className="logo-image" src={logo} alt="Logo" webp />
					</a>
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
						href="https://github.com/memorize-ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						GitHub
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
						href={SLACK_INVITE_URL}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Slack
					</a>
					<div className="divider" />
					<a
						href="https://blog.memorize.ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Blog
					</a>
					<div className="divider" />
					<a
						href={API_URL}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						API
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

export default HomeFooter
