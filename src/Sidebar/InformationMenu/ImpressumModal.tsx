import type { Dispatch, SetStateAction } from 'react';
import { Modal } from 'react-bootstrap';

interface ImpressumModalProps {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
}

export const ImpressumModal = ({ show, setShow }: ImpressumModalProps) => {
	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header style={{ padding: '20px 10%' }}>
				<Modal.Title>Impressum</Modal.Title>
			</Modal.Header>
			<Modal.Body className="side-padded-menu"></Modal.Body>
		</Modal>
	);
};
