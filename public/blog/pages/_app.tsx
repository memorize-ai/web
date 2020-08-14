import { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'

import shareImage from 'images/share.png'

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
			<link
				key="icon"
				rel="icon"
				href="https://memorize.ai/favicon.png"
			/>
			<meta key="meta-og-site-name" property="og:site_name" content="memorize.ai blog" />
			<meta key="meta-og-type" property="og:type" content="website" />
			<meta key="meta-og-image" property="og:image" content={shareImage} />
			<meta key="meta-twitter-card" name="twitter:card" content="summary_large_image" />
			<meta key="meta-twitter-site" name="twitter:site" content="@memorize_ai" />
			<meta key="meta-twitter-creator" name="twitter:creator" content="@memorize_ai" />
			<meta key="meta-twitter-domain" name="twitter:domain" content="blog.memorize.ai" />
			<meta key="meta-twitter-image" name="twitter:image" content={shareImage} />
		</Head>
		<RecoilRoot>
			<Component {...pageProps} />
		</RecoilRoot>
	</>
)

export default App
