import { useEffect } from 'react'
import AOS from 'aos'

import PreviewDeck from 'models/PreviewDeck'
import Head from 'components/Head'
import TopGradient from 'components/TopGradient'
import Navbar from 'components/Navbar'
import Header from './Header'
import SpacedRepetition from './SpacedRepetition'
import Preview from './Preview'
import SectionDivider from './SectionDivider'
import Screenshots from './Screenshots'
import Classroom from './Classroom'
import Footer from './Footer'

import 'aos/dist/aos.css'
import styles from './index.module.scss'

export interface HomeProps {
	previewDeck: PreviewDeck | null
}

const Home = ({ previewDeck }: HomeProps) => {
	useEffect(() => {
		AOS.init({ anchorPlacement: 'top-bottom' })
	}, [])

	return (
		<>
			<Head
				url="/"
				title="memorize.ai: Learn Lazily"
				breadcrumbs={url => [[{ name: 'memorize.ai', url }]]}
			/>
			<TopGradient className={styles.header}>
				<Navbar padding={false} />
				<Header />
			</TopGradient>
			<SpacedRepetition />
			<Preview deck={previewDeck} />
			<SectionDivider />
			<Screenshots />
			<Classroom />
			<Footer />
		</>
	)
}

export default Home
