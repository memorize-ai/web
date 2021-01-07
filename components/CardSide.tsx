import { HTMLAttributes, useCallback } from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'
import { highlightAllUnder } from 'prismjs'
import cx from 'classnames'

const CardSide = ({
	className,
	children,
	...props
}: { children: string } & HTMLAttributes<HTMLDivElement>) => {
	const onRef = useCallback(
		(element: HTMLDivElement | null) => {
			if (!element) return

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
		<div {...props} className={cx('card-side', className)}>
			<div
				className="content"
				ref={onRef}
				dangerouslySetInnerHTML={{ __html: children }}
			/>
		</div>
	)
}

export default CardSide
