import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { config } from '@fortawesome/fontawesome-svg-core'

import Analytics from 'components/Analytics'
import Chat from 'components/Chat'
import Progress from 'components/Progress'
import AuthModal from 'components/Modal/Auth'

import { src as favicon } from 'images/favicon.png'

import 'components/App/index.scss'
import 'components/Progress/index.scss'

config.autoAddCss = false

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
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
			<link key="icon" rel="icon" href={favicon} />
			<link key="apple-touch-icon" rel="apple-touch-icon" href={favicon} />
			<link key="manifest" rel="manifest" href="/manifest.webmanifest" />
			<link
				key="sitemap"
				rel="sitemap"
				type="application/xml"
				href="/sitemap.xml"
			/>
		</Head>
		<Analytics />
		<Chat />
		<Progress />
		<ToastContainer />
		<RecoilRoot>
			<Component {...pageProps} />
			<AuthModal />
		</RecoilRoot>
	</>
)

export default App
