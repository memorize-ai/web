import React from 'react'

import FixedContainer from './ScreenshotsFixedContainer'
import Descriptions, { DescriptionsSide } from './ScreenshotsDescriptions'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'
import backgroundImage from '../../images/home-screenshots-background.png'

export const screenshots = [
	{
		type: ScreenshotType.Market,
		descriptions: [
			{
				title: 'Share your knowledge',
				body: 'We are a community of learners that create decks for one another; all decks are public, and anyone can use them.',
				margin: 20
			},
			{
				title: 'Easy to find what you\'re looking for',
				body: 'Recommendations and search results are ranked based on what you like, popularity, and ratings. Earn XP based on the popularity of your decks.',
				margin: 32
			}
		]
	},
	{
		type: ScreenshotType.Review,
		descriptions: [
			{
				title: 'Flashcards done right',
				body: 'Rate your performance only after you\'ve seen the back of the card.',
				margin: 20
			},
			{
				title: 'Revolutionary spaced repetition algorithm',
				body: 'Our algorithm learns as you learn. Over time, memorize.ai will get to know you so well that it can predict the perfect memorization timing far better than you could yourself!',
				margin: 35
			}
		]
	},
	{
		type: ScreenshotType.Cram,
		descriptions: [
			{
				title: 'Got a test tomorrow?',
				body: 'Master cards in a short period of time',
				margin: 20
			},
			{
				title: 'Effectively learn faster than you thought possible',
				body: 'By the end of a cram session, you\'ll be ready for whatever lies ahead.',
				margin: 30
			}
		]
	},
	{
		type: ScreenshotType.Editor,
		descriptions: [
			{
				title: 'Flashcards have never looked so good',
				body: 'Using the most advanced editor on a phone, design cards to your heart\'s desire.',
				margin: 20
			},
			{
				title: 'Free for everyone',
				body: `
					• LaTeX
					• Images
					• Code (automatic highlighting)
					• Tables
					• And more!
				`,
				margin: 20
			}
		]
	},
	{
		type: ScreenshotType.Decks,
		descriptions: [
			{
				title: 'Share with everyone',
				body: 'Embed links to download your deck and unlock certain sections.',
				margin: 20
			},
			{
				title: 'Spend little to no time reviewing every day',
				body: 'Review cards as they\'re due. This way, you\'ll learn better and save tremendous amounts of time.',
				margin: 30
			}
		]
	},
	{
		type: ScreenshotType.Home,
		descriptions: [
			{
				title: 'Quickly review and add decks',
				body: 'Recommendations based on what you like and what you need improvement on.',
				margin: 20
			},
			{
				title: 'Know what you need to do at a glance',
				body: 'Spend a couple minutes, but gain knowledge for a lifetime.',
				margin: 20
			}
		]
	},
	{
		type: ScreenshotType.Recap,
		descriptions: [
			{
				title: 'Earn XP and review your performance',
				body: 'Both you and memorize.ai will know what you need to work on.',
				margin: 20
			},
			{
				title: 'Earn streaks and gain mastery',
				body: 'Easily see how well you\'ve been performing, and work towards "mastery".',
				margin: 20
			}
		]
	}
]

export default () => (
	<div className="home screenshots stack">
		<div className="background origin-top-right" />
		<div id="home-screenshots-aos-anchor-first" className="content relative">
			<FixedContainer outerClassName="background" anchor="#home-screenshots-aos-anchor-first">
				<img
					className="background"
					src={backgroundImage}
					alt="Background"
					data-aos="disappear"
					data-aos-anchor="#home-screenshots-aos-anchor-last"
					data-aos-anchor-placement="bottom-bottom"
				/>
			</FixedContainer>
			<div className="screenshots">
				{screenshots.map(({ type, descriptions }, index) => (
					<div key={index}>
						<div
							id={`home-screenshots-aos-anchor-${index}`}
							className="absolute inset-x-0"
							style={{ top: `${index * 60}vh` }}
						/>
						<FixedContainer anchor={`#home-screenshots-aos-anchor-${index}`}>
							<Descriptions
								side={DescriptionsSide.Left}
								descriptions={descriptions.filter((_, i) => !(i & 1))}
								data-aos="disappear"
								data-aos-anchor={
									`#home-screenshots-aos-anchor-${
										index === screenshots.length - 1
											? 'last'
											: index + 1
									}`
								}
								data-aos-anchor-placement={
									index === screenshots.length - 1
										? 'bottom-bottom'
										: 'top-top'
								}
							/>
							<Screenshot
								type={type}
								className="screenshot mx-auto"
								data-aos="disappear"
								data-aos-anchor={
									`#home-screenshots-aos-anchor-${
										index === screenshots.length - 1
											? 'last'
											: index + 1
									}`
								}
								data-aos-anchor-placement={
									index === screenshots.length - 1
										? 'bottom-bottom'
										: 'top-top'
								}
							/>
							<Descriptions
								side={DescriptionsSide.Right}
								descriptions={descriptions.filter((_, i) => i & 1)}
								data-aos="disappear"
								data-aos-anchor={
									`#home-screenshots-aos-anchor-${
										index === screenshots.length - 1
											? 'last'
											: index + 1
									}`
								}
								data-aos-anchor-placement={
									index === screenshots.length - 1
										? 'bottom-bottom'
										: 'top-top'
								}
							/>
						</FixedContainer>
					</div>
				))}
			</div>
			<div id="home-screenshots-aos-anchor-last" className="absolute inset-x-0" />
		</div>
	</div>
)
