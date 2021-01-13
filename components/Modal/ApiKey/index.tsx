import { faKey } from '@fortawesome/free-solid-svg-icons'

import { ModalShowingProps } from '..'
import CopyModal from '../Copy'

export interface ApiKeyModalProps extends ModalShowingProps {
	value: string
}

const ApiKeyModal = ({ value, isShowing, setIsShowing }: ApiKeyModalProps) => (
	<CopyModal
		title="My API key"
		icon={faKey}
		text={value}
		isShowing={isShowing}
		setIsShowing={setIsShowing}
	/>
)

export default ApiKeyModal
