import React, { useState, useEffect, MouseEvent} from 'react'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'

import '../../scss/components/CreateDeck.scss'

export default () => {
	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
	
	const imageFile = acceptedFiles.length ? acceptedFiles[0] : null
	const [imageUrl, setImageUrl] = useState(null as string | null)
	
	useEffect(() => {
		setImageUrl(imageFile && URL.createObjectURL(imageFile))
	}, [imageFile])
	
	const removeImage = (event: MouseEvent) => {
		event.stopPropagation()
		setImageUrl(null)
	}
	
	return (
		<div className="create-deck">
			<TopGradient>
				<Navbar />
				<div className="main-box">
					<div
						{...getRootProps()}
						className={cx('image-picker', {
							dragging: isDragActive,
							'has-image': imageUrl
						})}
					>
						<input {...getInputProps()} />
						{imageUrl
							? (
								<>
									<img src={imageUrl} alt="Uploaded image" />
									<button onClick={removeImage}>
										&times;
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
				</div>
			</TopGradient>
		</div>
	)
}
