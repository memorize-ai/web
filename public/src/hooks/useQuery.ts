import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

export default () => {
	const { search } = useLocation()
	
	return useMemo(() => (
		new URLSearchParams(search)
	), [search])
}
