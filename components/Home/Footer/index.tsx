import Link from 'next/link'
import Img from 'react-optimized-image'

import AuthButton from '../AuthButton'
import AppStoreDownloadButton from 'components/AppStoreDownloadButton'
import { SLACK_INVITE_URL, API_URL } from 'lib/constants'

import logo from 'images/logos/capital.jpg'
import styles from './index.module.scss'

const HomeFooter = () => (
	<footer className={styles.root}>
		<div className={styles.background} />
		<div className={styles.content}>
			<div className={styles.top}>
				<h1 className={styles.topText} data-aos="fade-down">
					The ultimate
					<br />
					memorization tool
				</h1>
				<AuthButton className={styles.auth} />
			</div>
			<div className={styles.bottom}>
				<Link href="/">
					<a className={styles.logoLink}>
						<Img className={styles.logo} src={logo} alt="Logo" webp />
					</a>
				</Link>
				<div className={styles.links}>
					<a
						className={styles.link}
						href="mailto:support@memorize.ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Contact us
					</a>
					<div className={styles.linkDivider} />
					<a
						className={styles.link}
						href="https://github.com/memorize-ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						GitHub
					</a>
					<div className={styles.linkDivider} />
					<a
						className={styles.link}
						href="https://twitter.com/memorize_ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Twitter
					</a>
					<div className={styles.linkDivider} />
					<a
						className={styles.link}
						href={SLACK_INVITE_URL}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Slack
					</a>
					<div className={styles.linkDivider} />
					<a
						className={styles.link}
						href="https://blog.memorize.ai"
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						Blog
					</a>
					<div className={styles.linkDivider} />
					<a
						className={styles.link}
						href={API_URL}
						target="_blank"
						rel="noopener noreferrer nofollow"
					>
						API
					</a>
				</div>
				<AppStoreDownloadButton className={styles.download} />
				<p className={styles.copyright}>
					Copyright &copy; 2020 <b>memorize.ai Inc</b>. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
)

export default HomeFooter
