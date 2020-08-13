import { PropsWithChildren } from 'react'
import { MDXProvider } from '@mdx-js/react'

import Pre from './Pre'

const components = {
	pre: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
	code: Pre
}

const CustomMDXProvider = ({ children }: PropsWithChildren<{}>) => (
	<MDXProvider components={components}>
		{children}
	</MDXProvider>
)

export default CustomMDXProvider
