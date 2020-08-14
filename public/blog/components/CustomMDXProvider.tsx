import { PropsWithChildren, AnchorHTMLAttributes, useMemo } from 'react'
import Link from 'next/link'
import { MDXProvider } from '@mdx-js/react'

import Pre from './Pre'

import styles from 'styles/components/CustomMDXProvider.module.scss'

const baseComponents = {
	pre: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
	code: Pre
}

const EnabledLink = ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
	href.startsWith('/p/')
		? (
			<Link href="/p/[slug]" as={href}>
				<a {...props}>{children}</a>
			</Link>
		)
		: (
			<a {...props} href={href} rel="noopener noreferrer">
				{children}
			</a>
		)
)

const DisabledLink = ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
	<span {...props} className={styles.disabledLink}>
		{children}
	</span>
)

const getComponents = (allowLinks: boolean) => ({
	...baseComponents,
	a: allowLinks ? EnabledLink : DisabledLink
})

export interface CustomMDXProviderProps extends PropsWithChildren<{}> {
	allowLinks: boolean
}

const CustomMDXProvider = ({ allowLinks, children }: CustomMDXProviderProps) => {
	const components = useMemo(() => (
		getComponents(allowLinks)
	), [allowLinks])
	
	return (
		<MDXProvider components={components}>
			{children}
		</MDXProvider>
	)
}

export default CustomMDXProvider
