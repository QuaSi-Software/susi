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
					<i className="bi bi-info"></i>
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
