import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
	render = () => (
		<Html lang="en">
			<Head>
				<script
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
					data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT}
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
