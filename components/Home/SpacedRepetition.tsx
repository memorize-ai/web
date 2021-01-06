import Image from 'react-optimized-image'

import spacedRepetition from 'images/home/spaced-repetition.png'

const HomeSpacedRepetition = () => (
	<div className="spaced-repetition">
		<Image
			className="diagram"
			src={spacedRepetition}
			alt="Spaced Repetition diagram"
			webp
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

export default HomeSpacedRepetition
