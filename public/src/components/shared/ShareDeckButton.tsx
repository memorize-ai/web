import React, { PropsWithChildren } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

export default (
	{ deckId, onCopy, children }: PropsWithChildren<{
		deckId: string
		onCopy: () => void
	}>
) => (
	<CopyToClipboard text={`https://memorize.ai/d/${deckId}`} onCopy={onCopy}>
		{children}
	</CopyToClipboard>
)
