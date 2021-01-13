import { useRef, useCallback, useEffect } from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import { toast } from 'react-toastify'

import { RouterErrorEventHandler, RouterEventHandler } from './models'
import { START_POSITION, DELAY } from './constants'

const Progress = () => {
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
			toast.error(error.message)
		},
		[success]
	)

	useEffect(() => {
		Router.events.on('routeChangeStart', start)
		Router.events.on('routeChangeComplete', success)
		Router.events.on('routeChangeError', error)
	}, [start, success, error])

	return null
}

export default Progress
