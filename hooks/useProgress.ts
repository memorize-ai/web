import { useRef, useCallback, useEffect } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'

import { RouterErrorEventHandler, RouterEventHandler } from 'models/Router'
import { START_POSITION, DELAY } from 'components/Progress/constants'
import handleError from 'lib/handleError'

const useProgress = () => {
	const timer = useRef<number | null>(null)

	const start: RouterEventHandler = useCallback((_url, { shallow }) => {
		if (shallow) return

		NProgress.set(START_POSITION)
		NProgress.start()
	}, [])

	const success: RouterEventHandler = useCallback(
		(_url, { shallow }) => {
			if (shallow) return
			if (timer.current) window.clearTimeout(timer.current)

			timer.current = window.setTimeout(() => {
				NProgress.done()
			}, DELAY)
		},
		[timer]
	)

	const error: RouterErrorEventHandler = useCallback(
		(error, url, options) => {
			success(url, options)

			if (error.cancelled) return
			handleError(error)
		},
		[success]
	)

	useEffect(
		() => () => {
			if (!timer.current) return
			window.clearTimeout(timer.current)
		},
		[timer]
	)

	useEffect(() => {
		Router.events.on('routeChangeStart', start)
		Router.events.on('routeChangeComplete', success)
		Router.events.on('routeChangeError', error)

		return () => {
			Router.events.off('routeChangeStart', start)
			Router.events.off('routeChangeComplete', success)
			Router.events.off('routeChangeError', error)
		}
	}, [start, success, error])
}

export default useProgress
