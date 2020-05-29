import { useEffect } from 'react'
import { useRouter } from 'next/router'

import useAuthState from './useAuthState'
import { urlWithQuery } from 'lib/utils'

export default (next: string | null = null) => {
	const router = useRouter()
	const isSignedIn = useAuthState()
	
	useEffect(() => {
		if (isSignedIn)
			return
		
		router.push(urlWithQuery('/', {
			next: next ?? router.asPath
		}))
	}, [isSignedIn, router, next])
}
