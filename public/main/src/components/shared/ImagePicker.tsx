import React, { memo } from 'react'
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Loader from './Loader'

import '../../scss/components/ImagePicker.scss'

const ImagePicker = (
	{ rootProps, inputProps, isDragging, isLoading = false, url, removeImage }: {
		rootProps: DropzoneRootProps
		inputProps: DropzoneInputProps
		isDragging: boolean
		isLoading?: boolean
		url: string | null
		removeImage: () => void
	}
) => (
	<div
		{...rootProps}
		className={cx('image-picker', {
			dragging: isDragging,
			'has-image': url
		})}
	>
		<input {...inputProps} />
		{isLoading
			? <Loader size="24px" thickness="4px" color="rgba(74, 74, 74, 0.5)" />
			: url
				? (
					<>
						<img src={url} alt="Uploaded" />
						<button onClick={event => {
							event.stopPropagation()
							removeImage()
						}}>
							<FontAwesomeIcon icon={faTimesCircle} />
						</button>
					</>
				)
				: (
					<div className="message">
						<p>Choose image</p>
						<p>Click or drag</p>
					</div>
				)
		}
	</div>
)

export default memo(ImagePicker)
