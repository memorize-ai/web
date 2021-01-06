import Image from 'react-optimized-image'

import star from 'images/icons/star.jpg'

const Star = ({ fill }: { fill: number }) => (
	<div>
		<div style={{ width: `${fill}%` }} />
		<Image src={star} alt={`Star ${fill}%`} webp original />
	</div>
)

export default Star
