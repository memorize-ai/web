import React from 'react'
import cx from 'classnames'

import LoadingState from '../../models/LoadingState'
import Loader from '../shared/Loader'

import styles from '../../styles/components/Unsubscribe.module.scss'

export default (
	{ loadingState, errorMessage }: {
		loadingState: LoadingState
		errorMessage: string | null
	}
) => {
	switch (loadingState) {
		case LoadingState.Loading:
			return (
				<>
					<h1 className={cx(styles.text, styles.loadingText)}>
						Unsubscribing...
					</h1>
					<Loader
						className={styles.loader}
						size="24px"
						thickness="4px"
						color="#582efe"
					/>
				</>
			)
		case LoadingState.Success:
			return (
				<h1 className={cx(styles.text, styles.successText)}>
					Unsubscribed
				</h1>
			)
		case LoadingState.Fail:
			return (
				<h1 className={cx(styles.text, styles.failText)}>
					{errorMessage ?? 'An unknown error occurred'}
				</h1>
			)
		default:
			return null
	}
}
