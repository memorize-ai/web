import Document, { Html, Head, Main, NextScript } from 'next/document'

const adClient = process.env.NEXT_PUBLIC_AD_CLIENT
if (!adClient) throw new Error('Missing ad client')

export default class CustomDocument extends Document {
	render = () => (
		<Html lang="en">
			<Head>
				<script
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
					data-ad-client={adClient}
					async
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
				<script> </script>
			</body>
		</Html>
	)
}
