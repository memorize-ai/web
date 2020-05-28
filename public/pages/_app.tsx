import { AppProps } from 'next/app'

import 'styles/global.scss'

export default ({ Component, pageProps }: AppProps) => (
	<Component {...pageProps} />
)
