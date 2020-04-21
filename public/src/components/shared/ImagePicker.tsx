import React from 'react'
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import '../../scss/components/ImagePicker.scss'

export default (
	{ rootProps, inputProps, isDragging, url, removeImage }: {
		rootProps: DropzoneRootProps
		inputProps: DropzoneInputProps
		isDragging: boolean
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
		{url
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
