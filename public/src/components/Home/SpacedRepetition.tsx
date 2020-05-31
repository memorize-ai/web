import React, { memo } from 'react'

import spacedRepetitionImage from '../../images/home/spaced-repetition.png'

import '../../scss/components/Home/SpacedRepetition.scss'

const HomeSpacedRepetition = () => (
	<div className="spaced-repetition">
		<img
			className="diagram"
			src={spacedRepetitionImage}
			alt="Spaced Repetition diagram"
		/>
		<article className="text">
			<h2 className="title">
				<strong>Spaced Repetition</strong><br />
				is the future
			</h2>
			<p className="description">
				abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc
			</p>
		</article>
	</div>
)

export default memo(HomeSpacedRepetition)
