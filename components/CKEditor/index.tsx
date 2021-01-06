import dynamic from 'next/dynamic'

import Loader from './Loader'

export default dynamic(() => import('./Content'), {
	ssr: false,
	loading: () => <Loader />
})
