import { useState } from 'react';
import { CustomModal } from '../Modals/CustomModal';
import { InformationMenu } from '../Modals/InformationMenu/InformationMenu';
import { Impressum } from '../Modals/InformationMenu/Impressum';

export const ModalType = {
	Instructions: 'Instructions',
	Settings: 'Settings',
	ProjectInfo: 'Project Info',
} as const;
export type ModalType = (typeof ModalType)[keyof typeof ModalType];

interface Props {
	theme: 'dark' | 'light';
}

export function TopRightButtonsMenu({ theme }: Props) {
	const [modalType, setModalType] = useState<ModalType>();

	function closeModal() {
		setModalType(undefined);
	}

	return (
		<>
			{/** Buttons */}
			<div className="top-right-button-container">
				<button onClick={() => setModalType(ModalType.ProjectInfo)}>
					<i className="bi bi-info-circle"></i>
				</button>
				<button onClick={() => setModalType(ModalType.Instructions)}>
					<i className="bi bi-question-circle"></i>
				</button>
				<button onClick={() => setModalType(ModalType.Settings)}>
					<i className="bi bi-gear-fill"></i>
				</button>
			</div>
			{/** Modals */}
			<>
				<CustomModal show={modalType === ModalType.ProjectInfo} closeModal={closeModal} title="Project Info">
					<InformationMenu theme={theme} />
					<Impressum />
				</CustomModal>
			</>
		</>
	);
}
