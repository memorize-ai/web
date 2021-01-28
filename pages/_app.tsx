import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { config } from '@fortawesome/fontawesome-svg-core'

import useProgress from 'hooks/useProgress'
import useChat from 'hooks/useChat'
import Config from 'components/App/Config'
import AuthModal from 'components/Modal/Auth'
import IntroModal from 'components/Modal/Intro'

import { src as favicon } from 'images/favicon.png'

import 'components/App/index.scss'
import 'components/Progress/index.scss'

config.autoAddCss = false

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
	useProgress()
	useChat()

	return (
		<>
			<Head>
				<link
					key="fonts-googleapis-preconnect"
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					key="fonts-gstatic-preconnect"
					rel="preconnect"
					href="https://fonts.gstatic.com"
				/>
				<link
					key="muli-stylesheet"
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Muli:wght@200;300;400;500;600;700;800;900&display=swap"
				/>
				<meta key="theme-color" name="theme-color" content="#fff" />
				<meta
					key="keywords"
					name="keywords"
					content="memorize,ai,spaced,repetition,learn,remember,cram,study,quiz,flash,card,flashcards,master,language"
				/>
				<meta key="author" name="author" content="Ken Mueller" />
				<meta
					key="app"
					name="apple-itunes-app"
					content={`app-id=${process.env.NEXT_PUBLIC_APP_ID}`}
				/>
				<link key="icon" rel="icon" href={favicon} />
				<link key="apple-touch-icon" rel="apple-touch-icon" href={favicon} />
				<link key="manifest" rel="manifest" href="/manifest.webmanifest" />
				<link
					key="sitemap"
					rel="sitemap"
					type="application/xml"
					href="/sitemap.xml"
				/>
				<link
					key="analytics-preload"
					rel="preload"
					href="https://www.googletagmanager.com/gtag/js?l=dataLayer"
					as="script"
				/>
			</Head>
			<ToastContainer />
			<RecoilRoot>
				<Config />
				<Component {...pageProps} />
				<AuthModal />
				<IntroModal />
			</RecoilRoot>
		</>
	)
}

export default App
