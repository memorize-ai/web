import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faImage } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Loader from '../Loader'

import styles from './index.module.scss'

export interface ImagePickerProps {
	className?: string
	rootProps: DropzoneRootProps
	inputProps: DropzoneInputProps
	isDragging: boolean
	isLoading?: boolean
	url: string | null
	removeImage(): void
}

const ImagePicker = ({
	className,
	rootProps,
	inputProps,
	isDragging,
	isLoading = false,
	url,
	removeImage
}: ImagePickerProps) => (
	<div
		{...rootProps}
		className={cx(styles.root, className, {
			[styles.dragging]: isDragging
		})}
	>
		<input {...inputProps} />
		{isLoading ? (
			<Loader size="24px" thickness="4px" color="#4a4a4a80" />
		) : url ? (
			<>
				<img className={styles.image} src={url} alt="Uploaded" />
				<button
					className={styles.remove}
					onClick={event => {
						event.stopPropagation()
						removeImage()
					}}
				>
					<FontAwesomeIcon className={styles.removeIcon} icon={faTimesCircle} />
				</button>
			</>
		) : (
			<div className={styles.message}>
				<FontAwesomeIcon className={styles.icon} icon={faImage} />
				<p className={styles.title}>Choose image</p>
				<p className={styles.subtitle}>Click or drag</p>
			</div>
		)}
	</div>
)

export default ImagePicker
