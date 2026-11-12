import type { ReactNode } from 'react';
import { Modal } from 'react-bootstrap';

interface ModalProps {
	show: boolean;
	closeModal: () => void;
	title: string;
	children: ReactNode;
}

export const CustomModal = ({ show, closeModal, children, title }: ModalProps) => {
	return (
		<Modal show={show} onHide={closeModal}>
			<Modal.Header style={{ padding: '20px 10%' }}>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="side-padded-menu">{children}</Modal.Body>
		</Modal>
	);
};
