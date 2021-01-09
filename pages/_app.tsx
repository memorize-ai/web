import { useEffect } from 'react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import { config } from '@fortawesome/fontawesome-svg-core'

import AuthModal from 'components/Modal/Auth'
import { src as favicon } from 'images/favicon.png'

import 'styles/global.scss'
import 'styles/ConfirmationForm.scss'
import 'styles/SectionHeader/Base.scss'
import 'styles/SectionHeader/index.scss'
import 'styles/SectionHeader/Owned.scss'
import 'styles/DeckCell/Base.scss'
import 'styles/DeckCell/index.scss'
import 'styles/DeckCell/Owned.scss'
import 'styles/Dashboard/Interests.scss'
import 'styles/Dashboard/Review.scss'
import 'styles/Dashboard/index.scss'
import 'styles/Dashboard/Home.scss'
import 'styles/Dashboard/Navbar.scss'
import 'styles/Dashboard/Decks.scss'
import 'styles/Dashboard/DeckPage.scss'
import 'styles/Dashboard/EditCard.scss'
import 'styles/Dashboard/AddCards.scss'
import 'styles/Dashboard/EditDeck.scss'
import 'styles/Dashboard/Market.scss'
import 'styles/Dashboard/Sidebar.scss'
import 'styles/Dashboard/Cram.scss'
import 'styles/Dashboard/PublishDeck.scss'
import 'styles/Dropdown.scss'
import 'styles/Input.scss'
import 'styles/TopGradient.scss'
import 'styles/ReportMessage.scss'
import 'styles/PublishDeckContent.scss'
import 'styles/SortDropdown.scss'
import 'styles/Policy.scss'
import 'styles/ImagePicker.scss'
import 'styles/CardCell/Base.scss'
import 'styles/CardCell/Owned.scss'
import 'styles/Modal/Confirmation.scss'
import 'styles/Modal/Auth.scss'
import 'styles/Modal/index.scss'
import 'styles/Modal/Input.scss'
import 'styles/Modal/ContactUser.scss'
import 'styles/Modal/Copy.scss'

config.autoAddCss = false

const hubspotUrl = process.env.NEXT_PUBLIC_HUBSPOT_URL
if (!hubspotUrl) throw new Error('Missing HubSpot URL')

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
	useEffect(() => {
		const script = document.createElement('script')

		script.id = 'hs-script-loader'
		script.src = hubspotUrl
		script.async = true

		document.body.append(script)
	}, [])

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
				<meta key="theme-color" name="theme-color" content="#ffffff" />
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
			<RecoilRoot>
				<Component {...pageProps} />
				<AuthModal />
			</RecoilRoot>
			<ToastContainer />
		</>
	)
}

export default App
