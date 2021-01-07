import { useContext, useRef, useState, useCallback, useMemo } from 'react'
import { GetStaticProps, NextPage } from 'next'
import Router from 'next/router'

import CreateDeckContext from 'contexts/CreateDeck'
import useAuthModal from 'hooks/useAuthModal'
import useLayoutAuthState from 'hooks/useLayoutAuthState'
import useCurrentUser from 'hooks/useCurrentUser'
import User from 'models/User'
import Deck from 'models/Deck'
import Topic, { TopicData } from 'models/Topic'
import LoadingState from 'models/LoadingState'
import {
	setCreateDeckImage,
	setCreateDeckName,
	setCreateDeckSubtitle,
	setCreateDeckDescription,
	setCreateDeckTopics
} from 'actions'
import { compose, handleError } from 'lib/utils'
import getTopics from 'lib/getTopics'
import Dashboard, {
	DashboardNavbarSelection as Selection
} from 'components/Dashboard'
import Head from 'components/Head'
import PublishDeckContent from 'components/PublishDeckContent'
import Button from 'components/Button'

const HEAD_DESCRIPTION = 'Create your own deck on memorize.ai.'

interface CreateDeckProps {
	topics: TopicData[]
}

const CreateDeck: NextPage<CreateDeckProps> = ({ topics: initialTopics }) => {
	const topics = useMemo(() => initialTopics.map(data => new Topic(data)), [
		initialTopics
	])

	const [
		{ image, name, subtitle, description, topics: selectedTopics },
		dispatch
	] = useContext(CreateDeckContext)

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
			dispatch(setCreateDeckImage(image))
		},
		[dispatch]
	)

	const reset = useCallback(() => {
		dispatch(setCreateDeckImage(null))
		dispatch(setCreateDeckName(''))
		dispatch(setCreateDeckSubtitle(''))
		dispatch(setCreateDeckDescription(''))
		dispatch(setCreateDeckTopics([]))
	}, [dispatch])

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

				Router.push(`/decks/${slugId}/${slug}`)
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

	const setName = useCallback(compose(dispatch, setCreateDeckName), [dispatch])
	const setSubtitle = useCallback(compose(dispatch, setCreateDeckSubtitle), [
		dispatch
	])
	const setDescription = useCallback(
		compose(dispatch, setCreateDeckDescription),
		[dispatch]
	)
	const setSelectedTopics = useCallback(
		compose(dispatch, setCreateDeckTopics),
		[dispatch]
	)

	return (
		<Dashboard
			selection={isSignedIn ? Selection.Home : Selection.Market}
			className="create-deck publish-deck"
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
			<div className="header">
				<h1>Create deck</h1>
				<Button
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
			<div className="content">
				<div className="box">
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

export const getStaticProps: GetStaticProps<
	CreateDeckProps,
	Record<string, never>
> = async () => ({
	props: { topics: await getTopics() },
	revalidate: 3600 // 1 hour
})

export default CreateDeck
