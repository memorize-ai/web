import React, { HTMLAttributes } from 'react'

import { APP_STORE_URL } from '../../constants'
import { ReactComponent as AppStoreDownloadImage } from '../../images/app-store-download.svg'
import firebase from '../../firebase'

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
