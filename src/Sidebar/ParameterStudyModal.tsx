import type { Dispatch, SetStateAction } from 'react';
import { Modal } from 'react-bootstrap';
import type { ResieParameterMenuInfo } from './ResieParameters/ResieParameterMenuInfo';
import type { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';

interface ModalProps {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
}
export type ParameterStudy = Record<string, Record<string, InputObject[]>>;

export interface ParameterStudyModalProps {
	parameterStudyMenus: ResieParameterMenuInfo[];
	parameterStudyOptions: InputObject[];
	parameterStudy: ParameterStudy; // { node_id: { parameter_name: InputObject }}
	setParameterStudy: Dispatch<SetStateAction<ParameterStudy>>;
}

export const ParameterStudyModal = ({ show, setShow }: ParameterStudyModalProps & ModalProps) => {
	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header style={{ padding: '20px 10%' }}>
				<Modal.Title>Parameter Study</Modal.Title>
			</Modal.Header>

			<Modal.Body className="side-padded-menu"></Modal.Body>
		</Modal>
	);
};
