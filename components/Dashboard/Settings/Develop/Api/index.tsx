import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faChevronRight,
	faBook,
	faEye
} from '@fortawesome/free-solid-svg-icons'

import { API_URL } from 'lib/constants'
import useCurrentUser from 'hooks/useCurrentUser'
import ApiKeyModal from 'components/Modal/ApiKey'

import styles from './index.module.scss'

const DeveloperSettingsApi = () => {
	const { query } = useRouter()
	const shouldShowApiKey = 'key' in query

	const [currentUser] = useCurrentUser()
	const [isApiKeyModalShowing, setIsApiKeyModalShowing] = useState(false)

	const showApiKey = useCallback(() => {
		setIsApiKeyModalShowing(true)
	}, [setIsApiKeyModalShowing])

	useEffect(() => {
		setIsApiKeyModalShowing(shouldShowApiKey)
	}, [shouldShowApiKey, setIsApiKeyModalShowing])

	return (
		<div className={styles.root}>
			<h3 className={styles.title}>API</h3>
			<p className={styles.subtitle}>Integrate with your own services</p>
			<a
				className={styles.action}
				href={API_URL}
				target="_blank"
				rel="nofollow noreferrer noopener"
			>
				<FontAwesomeIcon className={styles.icon} icon={faBook} />
				API docs
				<FontAwesomeIcon className={styles.arrow} icon={faChevronRight} />
			</a>
			<button className={styles.action} onClick={showApiKey}>
				<FontAwesomeIcon className={styles.icon} icon={faEye} />
				My API key
				<FontAwesomeIcon className={styles.arrow} icon={faChevronRight} />
			</button>
			{currentUser?.apiKey && (
				<ApiKeyModal
					value={currentUser.apiKey}
					isShowing={isApiKeyModalShowing}
					setIsShowing={setIsApiKeyModalShowing}
				/>
			)}
		</div>
	)
}

export default DeveloperSettingsApi
