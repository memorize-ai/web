import React from 'react'

import FixedContainer from './ScreenshotsFixedContainer'
import Descriptions, { DescriptionsSide } from './ScreenshotsDescriptions'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'
import backgroundImage from '../../images/home-screenshots-background.png'

const screenshots = [
	{
		type: ScreenshotType.Cram,
		descriptions: [
			{
				title: 'Share your knowledge',
				body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them',
				margin: 20
			},
			{
				title: 'Easy-to-use rich text editor',
				body: `
					We support:
					• Images
					• Tables
					• Code (with automatic highlighting)
					• LaTeX
					• And more!
				`,
				margin: 35
			}
		]
	},
	// {
	// 	type: ScreenshotType.Cram,
	// 	descriptions: [
	// 		{
	// 			title: 'Share your knowledge',
	// 			body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them'
	// 		}
	// 	]
	// },
	// {
	// 	type: ScreenshotType.Cram,
	// 	descriptions: [
	// 		{
	// 			title: 'Share your knowledge',
	// 			body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them'
	// 		}
	// 	]
	// },
	// {
	// 	type: ScreenshotType.Cram,
	// 	descriptions: [
	// 		{
	// 			title: 'Share your knowledge',
	// 			body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them'
	// 		}
	// 	]
	// },
	// {
	// 	type: ScreenshotType.Cram,
	// 	descriptions: [
	// 		{
	// 			title: 'Share your knowledge',
	// 			body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them'
	// 		}
	// 	]
	// },
	// {
	// 	type: ScreenshotType.Cram,
	// 	descriptions: [
	// 		{
	// 			title: 'Share your knowledge',
	// 			body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them'
	// 		}
	// 	]
	// }
]

export default () => (
	<div className="home screenshots stack">
		<div className="background origin-top-right" />
		<div
			id="home-screenshots-aos-anchor"
			className="content relative"
		>
			<FixedContainer outerClassName="background" anchor="#home-screenshots-aos-anchor">
				<img className="background" src={backgroundImage} alt="Background" />
			</FixedContainer>
			<div className="screenshots">
				{screenshots.map(({ type, descriptions }, index) => (
					<div key={index}>
						<div
							id={`home-screenshots-aos-anchor-${index}`}
							className="anchor absolute inset-x-0"
							style={{ top: `${index * 60}vh` }}
						/>
						<FixedContainer anchor={`#home-screenshots-aos-anchor-${index}`}>
							<Descriptions
								side={DescriptionsSide.Left}
								descriptions={descriptions.filter((_, i) => !(i & 1))}
							/>
							<Screenshot type={type} className="screenshot" />
							<Descriptions
								side={DescriptionsSide.Right}
								descriptions={descriptions.filter((_, i) => i & 1)}
							/>
						</FixedContainer>
					</div>
				))}
			</div>
		</div>
	</div>
)
