import React, { memo } from 'react'

import LoadingState from '../../models/LoadingState'
import Loader from '../shared/Loader'

const UnsubscribeContent = (
	{ loadingState, errorMessage }: {
		loadingState: LoadingState
		errorMessage: string | null
	}
) => {
	switch (loadingState) {
		case LoadingState.Loading:
			return (
				<>
					<h1>Unsubscribing...</h1>
					<Loader size="24px" thickness="4px" color="#582efe" />
				</>
			)
		case LoadingState.Success:
			return <h1>Unsubscribed</h1>
		case LoadingState.Fail:
			return <h1>{errorMessage ?? 'An unknown error occurred'}</h1>
		default:
			return null
	}
}

export default memo(UnsubscribeContent)
