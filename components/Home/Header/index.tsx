import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import AuthButton from '../WhiteArrowAuthButton'
import Screenshot, { ScreenshotType } from 'components/Screenshot'
import { APP_STORE_URL } from 'lib/constants'
import { isIosHandheld } from 'lib/ios'

import styles from './index.module.scss'

const HomeHeader = () => (
	<header className={styles.root}>
		<article className={styles.article}>
			<h1 className={styles.title}>
				The ultimate
				<br />
				memorization tool
			</h1>
			<h3 className={styles.subtitle}>
				We use <b>AI</b> to accurately predict when you need to review. Welcome
				to efficient and effective memorization.
			</h3>
			<div className={styles.footer}>
				<AuthButton className={styles.auth}>Get started</AuthButton>
				{isIosHandheld() || (
					<a
						className={styles.download}
						href={APP_STORE_URL}
						rel="nofollow noreferrer noopener"
					>
						<FontAwesomeIcon className={styles.downloadIcon} icon={faApple} />
						<span className={styles.downloadText}>Download</span>
					</a>
				)}
			</div>
		</article>
		<Screenshot type={ScreenshotType.Review} />
	</header>
)

export default HomeHeader
