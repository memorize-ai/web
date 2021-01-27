import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import styles from './index.module.scss'

const DeveloperSettingsGitHub = () => (
	<a
		className={styles.root}
		href="https://github.com/memorize-ai"
		target="_blank"
		rel="noopener noreferrer nofollow"
	>
		<FontAwesomeIcon className={styles.icon} icon={faGithub} />
		View on GitHub
	</a>
)

export default DeveloperSettingsGitHub
