import type { Dispatch, SetStateAction } from 'react';
import { Modal } from 'react-bootstrap';
import { changeInputListElement, type ResieParameterMenuInfo } from './ResieParameters/ResieParameterMenuInfo';
import type { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';
import { Accordion } from 'radix-ui';
import { AccordionInputMenu } from '../Reactflow-Components/CustomInputWidgets/AccordionInputMenu';

interface ModalProps {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
}
export type ParameterStudy = Record<string, Record<string, InputObject[]>>;

export interface ParameterStudyModalProps {
	parameterStudyMenus: ResieParameterMenuInfo[];
	setParameterStudyMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	parameterStudyOptions: InputObject[];
	parameterStudy: ParameterStudy; // { node_id: { parameter_name: InputObject }}
	setParameterStudy: Dispatch<SetStateAction<ParameterStudy>>;
}

export const ParameterStudyModal = ({
	show,
	setShow,
	parameterStudyMenus,
	setParameterStudyMenus,
}: ParameterStudyModalProps & ModalProps) => {
	function updateMenu(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		changeInputListElement(setParameterStudyMenus, menuTitle, key, value, isIncludedChange);
	}

	return (
		<Modal show={show} onHide={() => setShow(false)}>
			<Modal.Header style={{ padding: '20px 10%' }}>
				<Modal.Title>Parameter Study</Modal.Title>
			</Modal.Header>

			<Modal.Body className="side-padded-menu">
				<Accordion.Root className="AccordionRoot" type="multiple" defaultValue={[parameterStudyMenus[0].title]}>
					{parameterStudyMenus.map((menu) => (
						<AccordionInputMenu
							title={menu.title}
							inputs={menu.inputs}
							nodeId={null}
							onValueChange={(key, value) => updateMenu(menu!.title, key, value, false)}
							onIncludedChange={(key, value) => updateMenu(menu!.title, key, value, true)}
						/>
					))}
				</Accordion.Root>
			</Modal.Body>
		</Modal>
	);
};
