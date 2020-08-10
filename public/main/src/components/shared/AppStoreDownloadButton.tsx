import React, { HTMLAttributes } from 'react'

import { APP_STORE_URL } from '../../constants'
import { ReactComponent as AppStoreDownloadImage } from '../../images/app-store-download.svg'
import firebase from '../../firebase'

import 'firebase/analytics'

const analytics = firebase.analytics()

const AppStoreDownloadButton = (props: HTMLAttributes<HTMLAnchorElement>) => (
	<a
		{...props}
		href={APP_STORE_URL}
		target="_blank"
		rel="nofollow noreferrer noopener"
		onClick={() => analytics.logEvent('app_store_download_clicked')}
	>
		<AppStoreDownloadImage />
	</a>
)

export default AppStoreDownloadButton
