import { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'

import Provider from 'context'
import AuthModal from 'components/shared/Modal/Auth'

import 'styles/global.scss'

export default ({ Component, pageProps }: AppProps) => (
	<>
		<Head>
			<meta key="meta-theme-color" name="theme-color" content="#fff" />
			<meta
				key="meta-keywords"
				name="keywords"
				content="memorize,ai,spaced,repetition,learn,remember,cram,study,quiz,flash,card,flashcards,master,language"
			/>
			<meta key="meta-author" name="author" content="Ken Mueller" />
			<link key="link-icon" rel="icon" href="/favicon.png" />
			<link key="link-apple-touch-icon" rel="apple-touch-icon" href="/favicon.png" />
			<link key="link-manifest" rel="manifest" href="/manifest.json" />
			<link key="link-sitemap" rel="sitemap" type="application/xml" href="/sitemap.xml" />
			<link key="link-preconnect-fonts-gstatic" rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				key="link-stylesheet-muli"
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Muli:wght@200;300;400;500;600;700;800;900&display=swap"
			/>
			<title key="title">memorize.ai</title>
		</Head>
		<ToastContainer />
		<Provider>
			<AuthModal />
			<Component {...pageProps} />
		</Provider>
	</>
)
