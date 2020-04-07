import React, { PropsWithChildren } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

export default (
	{ slug, onCopy, children }: PropsWithChildren<{
		slug: string
		onCopy: () => void
	}>
) => (
	<CopyToClipboard text={`https://memorize.ai/d/${slug}`} onCopy={onCopy}>
		{children}
	</CopyToClipboard>
)
