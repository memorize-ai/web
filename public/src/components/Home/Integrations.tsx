import React from 'react'
import { Link } from 'react-router-dom'

import Logo, { LogoType } from '../shared/Logo'
import ListItem from './IntegrationsListItem'
import canvasImage from '../../images/home-integrations/canvas.png'
import googleClassroomImage from '../../images/home-integrations/google-classroom.png'
import schoologyImage from '../../images/home-integrations/schoology.png'
import classdojoImage from '../../images/home-integrations/classdojo.png'
import edmodoImage from '../../images/home-integrations/edmodo.png'
import udemyImage from '../../images/home-integrations/udemy.png'

export const listItems = [
	'Share your deck with a simple link',
	'Embed in your blog posts or ebooks',
	'Unlock sections for each chapter for your students',
	'Works with Canvas, Schoology, Google Classroom, Udemy, and more!'
]

export const integrations = [
	{
		src: canvasImage,
		alt: 'Canvas',
		href: 'https://www.instructure.com/canvas/'
	},
	{
		src: googleClassroomImage,
		alt: 'Google Classroom',
		href: 'https://classroom.google.com'
	},
	{
		src: schoologyImage,
		alt: 'Schoology',
		href: 'https://www.schoology.com'
	},
	{
		src: classdojoImage,
		alt: 'ClassDojo',
		href: 'https://www.classdojo.com'
	},
	{
		src: edmodoImage,
		alt: 'edmodo',
		href: 'https://www.edmodo.com'
	},
	{
		src: udemyImage,
		alt: 'Udemy',
		href: 'https://www.udemy.com'
	}
]

export default () => {
	const gridItems = integrations.map(({ src, alt, href }, index) => (
		<a
			key={index}
			rel="noopener noreferrer"
			target="_blank"
			href={href}
		>
			<img
				className="bg-white shadow-sm shadow-raise-on-hover"
				src={src}
				alt={alt}
				data-aos="flip-up"
				data-aos-anchor="#home-integrations-aos-anchor"
				data-aos-delay={index * 100}
			/>
		</a>
	))
	
	return (
		<div
			id="home-integrations-aos-anchor"
			className="home integrations flex flex-col items-center"
		>
			<div
				className="left flex flex-col items-start"
				data-aos="flip-up"
				data-aos-anchor="#home-integrations-aos-anchor"
				data-aos-delay="100"
			>
				<Link to="/">
					<Logo
						type={LogoType.CapitalInverted}
						className="logo raise-on-hover"
					/>
				</Link>
				<h1>Integrate your decks in your classroom, lecture review, and notes!</h1>
				<div className="items">
					{listItems.map((title, index) => (
						<ListItem key={index} title={title} />
					))}
				</div>
			</div>
			<div className="right grid gap-6">
				{gridItems}
			</div>
		</div>
	)
}
