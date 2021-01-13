import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import LoadingState from 'models/LoadingState'
import Loader from 'components/Loader'

export interface ConfirmationFormButtonContentProps {
	loadingState: LoadingState
	text: string
}

const ConfirmationFormButtonContent = ({
	loadingState,
	text
}: ConfirmationFormButtonContentProps) => {
	switch (loadingState) {
		case LoadingState.None:
			return <>{text}</>
		case LoadingState.Loading:
			return <Loader size="20px" thickness="4px" color="white" />
		case LoadingState.Success:
			return <FontAwesomeIcon icon={faCheck} />
		case LoadingState.Fail:
			return <FontAwesomeIcon icon={faTimes} />
	}
}

export default ConfirmationFormButtonContent
