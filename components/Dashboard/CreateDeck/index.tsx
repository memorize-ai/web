import { useRef, useState, useCallback, useMemo } from 'react'
import { NextPage } from 'next'
import Router from 'next/router'
import { useRecoilState } from 'recoil'

import { CreateDeckProps } from './models'
import useAuthModal from 'hooks/useAuthModal'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useCurrentUser from 'hooks/useCurrentUser'
import User from 'models/User'
import Deck from 'models/Deck'
import Topic from 'models/Topic'
import LoadingState from 'models/LoadingState'
import state, { initialState } from 'state/createDeck'
import { handleError } from 'lib/utils'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import PublishDeckContent from 'components/PublishDeckContent'
import Button from 'components/Button'

import styles from './index.module.scss'

const HEAD_DESCRIPTION = 'Create your own deck on memorize.ai.'

const CreateDeck: NextPage<CreateDeckProps> = ({ topics: initialTopics }) => {
	const topics = useMemo(() => initialTopics.map(data => new Topic(data)), [
		initialTopics
	])

	const [
		{ image, name, subtitle, description, topics: selectedTopics },
		setState
	] = useRecoilState(state)

	const imageUrl = useRef(null as string | null)

	const {
		setIsShowing: setAuthModalIsShowing,
		setCallback: setAuthModalCallback
	} = useAuthModal()

	const isSignedIn = useLayoutAuthState()
	const [currentUser] = useCurrentUser()

	const [loadingState, setLoadingState] = useState(LoadingState.None)

	const isLoading = loadingState === LoadingState.Loading
	const isDisabled = !name

	const setImage = useCallback(
		(image: File | null) => {
			imageUrl.current = image && URL.createObjectURL(image)
			setState(state => ({ ...state, image }))
		},
		[setState]
	)

	const reset = useCallback(() => {
		setState(initialState)
	}, [setState])

	const create = useCallback(() => {
		const callback = async (user: User) => {
			try {
				setLoadingState(LoadingState.Loading)

				const { slugId, slug } = await Deck.createForUserWithId(user.id, {
					image,
					name,
					subtitle,
					description,
					topics: selectedTopics
				})

				setLoadingState(LoadingState.Success)
				reset()

				Router.push(`/decks/${slugId}/${encodeURIComponent(slug)}`)
			} catch (error) {
				setLoadingState(LoadingState.Fail)
				handleError(error)
			}
		}

		if (currentUser) callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}, [
		currentUser,
		setAuthModalIsShowing,
		setAuthModalCallback,
		description,
		image,
		name,
		reset,
		selectedTopics,
		subtitle
	])

	const setName = useCallback(
		(name: string) => setState(state => ({ ...state, name })),
		[setState]
	)
	const setSubtitle = useCallback(
		(subtitle: string) => setState(state => ({ ...state, subtitle })),
		[setState]
	)
	const setDescription = useCallback(
		(description: string) => setState(state => ({ ...state, description })),
		[setState]
	)
	const setSelectedTopics = useCallback(
		(topics: string[]) => setState(state => ({ ...state, topics })),
		[setState]
	)

	return (
		<Dashboard
			className={styles.root}
			sidebarClassName={styles.sidebar}
			contentClassName={styles.content}
			selection={isSignedIn ? Selection.Home : Selection.Market}
		>
			<Head
				title="Create deck | memorize.ai"
				description={HEAD_DESCRIPTION}
				breadcrumbs={url => [
					[
						{ name: 'Market', url: '/market' },
						{ name: 'Create deck', url }
					],
					[
						{ name: 'Home', url: '' },
						{ name: 'Create deck', url }
					]
				]}
			/>
			<div className={styles.header}>
				<h1 className={styles.title}>Create deck</h1>
				<Button
					className={styles.submit}
					disabledClassName={styles.submitDisabled}
					loaderSize="20px"
					loaderThickness="4px"
					loaderColor="#582efe"
					loading={isLoading}
					disabled={isDisabled}
					onClick={create}
				>
					Create
				</Button>
			</div>
			<div className={styles.main}>
				<div className={styles.box}>
					<PublishDeckContent
						imageUrl={imageUrl.current}
						name={name}
						subtitle={subtitle}
						description={description}
						topics={topics}
						selectedTopics={selectedTopics}
						setImage={setImage}
						setName={setName}
						setSubtitle={setSubtitle}
						setDescription={setDescription}
						setSelectedTopics={setSelectedTopics}
					/>
				</div>
			</div>
		</Dashboard>
	)
}

export default CreateDeck
