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
		<article
			className="text"
			data-aos="fade-up"
		>
			<h2 className="title">
				<strong>Spaced Repetition</strong><br />
				with <strong>AI</strong>
			</h2>
			<p className="description">
				Tired of long study sessions?
				Memorization is <em>strongest</em> when timing it <strong>just right</strong>.
				Try to recall too early and it won't stick.
				Too late and you'll forget.
				Struggle a little to remember and you won't forget!
				We use artificial intelligence to get this spacing <strong>perfect</strong>.
			</p>
		</article>
	</div>
)

export default memo(HomeSpacedRepetition)
