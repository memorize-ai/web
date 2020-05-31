import React, { HTMLAttributes, useCallback, memo } from 'react'
import renderMathInElement from 'katex/dist/contrib/auto-render'
import { highlightAllUnder } from 'prismjs'
import cx from 'classnames'

import '../../scss/components/CardSide.scss'

const CardSide = ({ className, children, ...props }: { children: string } & HTMLAttributes<HTMLDivElement>) => {
	const onRef = useCallback((element: HTMLDivElement | null) => {
		if (!element)
			return
		
		renderMathInElement(element)
		highlightAllUnder(element)
		
		element.querySelectorAll('figure.image').forEach(figure => {
			const image = figure.querySelector('img')
			
			if (image)
				image.onerror = figure.remove.bind(figure)
		})
	}, [children]) // eslint-disable-line
	
	return (
		<div
			{...props}
			className={cx('card-side', className)}
			ref={onRef}
			dangerouslySetInnerHTML={{ __html: children }}
		/>
	)
}

export default memo(CardSide)
