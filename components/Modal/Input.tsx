import { useCallback, memo } from 'react'
import { Svg } from 'react-optimized-image'
import Modal, { ModalShowingProps } from 'components/Modal'

import times from 'images/icons/times.svg'

export interface InputModalProps extends ModalShowingProps {
	title: string
	placeholder: string
	buttonText: string
	buttonBackground?: string
	value: string
	setValue: (value: string) => void
	onClick: () => void
	isDisabled: boolean
}

const InputModal = ({
	title,
	placeholder,
	buttonText,
	buttonBackground = '',
	value,
	setValue,
	onClick,
	isDisabled,
	isShowing,
	setIsShowing
}: InputModalProps) => {
	const onInputRef = useCallback(
		(input: HTMLInputElement | null) => {
			if (input) input[isShowing ? 'focus' : 'blur']()
		},
		[isShowing]
	)

	return (
		<Modal
			className="input-modal"
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<div className="header">
				<h2 className="title">{title}</h2>
				<button className="hide" onClick={() => setIsShowing(false)}>
					<Svg src={times} />
				</button>
			</div>
			<div className="content">
				<input
					ref={onInputRef}
					placeholder={placeholder}
					value={value}
					onChange={({ target }) => setValue(target.value)}
				/>
				<button
					disabled={isDisabled}
					onClick={onClick}
					style={{ background: buttonBackground }}
				>
					{buttonText}
				</button>
			</div>
		</Modal>
	)
}

export default memo(InputModal)
