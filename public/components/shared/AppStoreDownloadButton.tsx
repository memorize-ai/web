import React, { HTMLAttributes } from 'react'

import { APP_STORE_URL } from 'lib/constants'
import firebase from 'lib/firebase'

import AppStoreDownloadImage from 'images/app-store-download.svg'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default (props: HTMLAttributes<HTMLAnchorElement>) => (
	<a
		{...props}
		href={APP_STORE_URL}
		onClick={() => analytics.logEvent('app_store_download_clicked')}
	>
		<AppStoreDownloadImage />
	</a>
)
