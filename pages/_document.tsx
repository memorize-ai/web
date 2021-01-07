import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class CustomDocument extends Document {
	render = () => (
		<Html lang="en">
			<Head />
			<body>
				<Main />
				<NextScript />
				<script
					id="hs-script-loader"
					src={process.env.NEXT_PUBLIC_HUBSPOT_URL}
					async
				/>
				<script> </script>
			</body>
		</Html>
	)
}
