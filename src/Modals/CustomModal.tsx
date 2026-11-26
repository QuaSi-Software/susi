import type { ReactNode } from 'react';
import { Modal } from 'react-bootstrap';
import { useCloseModalOnEnter } from './useCloseModalOnEnter';

interface ModalProps {
	show: boolean;
	closeModal: () => void;
	title: string;
	children: ReactNode;
}

export const CustomModal = ({ show, closeModal, children, title }: ModalProps) => {
	useCloseModalOnEnter(show, closeModal);

	return (
		<Modal show={show} onHide={closeModal} className="custom-modal">
			<Modal.Header style={{ padding: '20px 10%' }} closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="side-padded-menu">{children}</Modal.Body>
		</Modal>
	);
};
