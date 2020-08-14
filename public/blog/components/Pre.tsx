import Highlight, { defaultProps, Language } from 'prism-react-renderer'

export interface PreProps {
	className: string
	children: string
}

const Pre = ({ className, children }: PreProps) => {
	const language = className.replace(/^language\-/, '') as Language
	
	return (
		<Highlight {...defaultProps} code={children} language={language}>
			{({ className, tokens, getLineProps, getTokenProps }) => (
				<pre className={className}>
					{tokens.map((line, i) => (
						<div key={i} {...getLineProps({ line, key: i })}>
							{line.map((token, key) => (
								<span key={key} {...getTokenProps({ token, key })} />
							))}
						</div>
					))}
				</pre>
			)}
		</Highlight>
	)
}

export default Pre
