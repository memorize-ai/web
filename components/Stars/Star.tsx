import Img from 'react-optimized-image'

import star from 'images/icons/star.jpg'

const Star = ({ fill }: { fill: number }) => (
	<div>
		<div style={{ width: `${fill}%` }} />
		<Img src={star} alt={`Star ${fill}%`} webp original />
	</div>
)

export default Star
