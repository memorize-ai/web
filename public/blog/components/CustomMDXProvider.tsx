import { PropsWithChildren, AnchorHTMLAttributes, useMemo } from 'react'
import { MDXProvider } from '@mdx-js/react'

import Pre from './Pre'

import styles from 'styles/components/CustomMDXProvider.module.scss'

const baseComponents = {
	pre: ({ children }: PropsWithChildren<{}>) => <>{children}</>,
	code: Pre
}

const getComponents = (allowLinks: boolean) => ({
	...baseComponents,
	...allowLinks ? null : {
		a: ({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
			<span {...props} className={styles.disabledLink}>
				{children}
			</span>
		)
	}
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
