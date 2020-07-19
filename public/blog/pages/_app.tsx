import { AppProps } from 'next/app'
import Head from 'next/head'

import 'styles/global.scss'

const App = ({ Component, pageProps }: AppProps) => (
	<>
		<Head>
			<link
				key="font-preconnect"
				rel="preconnect"
				href="https://fonts.gstatic.com"
			/>
			<link
				key="muli-font"
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Muli:wght@400;700;900&display=swap"
			/>
		</Head>
		<Component {...pageProps} />
	</>
)

export default App
