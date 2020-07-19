import React, { memo, ImgHTMLAttributes } from 'react'

const WebP = (
	{ id, className, src, fallback, ...props }: {
		src: string
		fallback: string
	} & ImgHTMLAttributes<HTMLImageElement>
) => (
		<picture id={id} className={className}>
			<source srcSet={src} type="image/webp" />
			<img {...props} src={fallback} /* eslint-disable-line */ />
		</picture>
	)

export default memo(WebP)
