import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

import TopGradient from '../shared/TopGradient'
import Navbar from '../shared/Navbar'
import ImagePicker from '../shared/ImagePicker'

import '../../scss/components/CreateDeck.scss'

export default () => {
	const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
	
	const imageFile = acceptedFiles.length ? acceptedFiles[0] : null
	const [imageUrl, setImageUrl] = useState(null as string | null)
	
	useEffect(() => {
		setImageUrl(imageFile && URL.createObjectURL(imageFile))
	}, [imageFile])
	
	return (
		<div className="create-deck">
			<TopGradient>
				<Navbar />
				<div className="main-box">
					<ImagePicker
						rootProps={getRootProps()}
						inputProps={getInputProps()}
						isDragging={isDragActive}
						url={imageUrl}
						removeImage={() => setImageUrl(null)}
					/>
				</div>
			</TopGradient>
		</div>
	)
}
