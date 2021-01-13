import { HTMLAttributes, useCallback } from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'
import { highlightAllUnder } from 'prismjs'
import cx from 'classnames'

import Loader from 'components/Loader'

import styles from './index.module.scss'

export interface CardSideProps extends HTMLAttributes<HTMLDivElement> {
	isLoading?: boolean
	children?: string
}

const CardSideLoader = () => (
	<Loader size="30px" thickness="5px" color="#582efe" />
)

const CardSide = ({
	className,
	isLoading = false,
	children = '',
	...props
}: CardSideProps) => {
	const onRef = useCallback(
		(element: HTMLDivElement | null) => {
			if (!(element && children)) return

			renderMathInElement(element)
			highlightAllUnder(element)

			element.querySelectorAll('figure.image').forEach(figure => {
				const image = figure.querySelector('img')
				if (image) image.onerror = () => figure.remove()
			})
		},
		[children]
	)

	return (
		<div {...props} className={cx(styles.root, className)}>
			<div
				className={styles.content}
				ref={onRef}
				dangerouslySetInnerHTML={isLoading ? undefined : { __html: children }}
				children={isLoading ? <CardSideLoader /> : undefined}
			/>
		</div>
	)
}

export default CardSide
