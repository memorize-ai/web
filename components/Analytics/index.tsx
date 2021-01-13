import { useCallback, useEffect } from 'react'
import Router from 'next/router'

import { RouterEventHandler } from 'models/Router'
import firebase from 'lib/firebase'

import 'firebase/analytics'

const Analytics = () => {
	const onChange: RouterEventHandler = useCallback(url => {
		const analytics = firebase.analytics()

		analytics.setCurrentScreen(url)
		analytics.logEvent('screen_view', {
			app_name: 'memorize.ai',
			screen_name: url
		})
	}, [])

	useEffect(() => {
		const { pathname, search } = window.location
		onChange(`${pathname}${search}`, { shallow: false })
	}, [onChange])

	useEffect(() => {
		Router.events.on('routeChangeComplete', onChange)

		return () => {
			Router.events.off('routeChangeComplete', onChange)
		}
	}, [onChange])

	return null
}

export default Analytics
