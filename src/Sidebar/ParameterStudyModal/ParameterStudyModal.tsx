import type { Dispatch, SetStateAction } from 'react';
import { Modal } from 'react-bootstrap';
import { changeInputListElement, type ResieParameterMenuInfo } from '../ResieParameters/ResieParameterMenuInfo';
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import { Accordion } from 'radix-ui';
import { AccordionInputMenu } from '../../Reactflow-Components/CustomInputWidgets/AccordionInputMenu';
import { ParameterStudyMenu } from './ParameterStudyMenu';
import type { ComponentInputType } from '../../NodeDataStructures/Nodes/ComponentInputTypes';

interface ModalProps {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
}
export interface ParameterStudy {
	nodeId: string;
	inputType: ComponentInputType;
	resieName: string;
	inputs: InputObject[];
}

function parameterStudiesHaveWarning(parameterStudies: ParameterStudy[]) {
	return !parameterStudies.every((study) => study.inputs.every((input) => input.isValid()));
}

export function parameterStudyModalHasWarning(
	parameterStudies: ParameterStudy[],
	parameterStudyMenus: ResieParameterMenuInfo[]
): boolean {
	for (const menu of parameterStudyMenus) {
		/** If not every input is valid, return  true*/
		if (!menu.inputs.every((input) => input.isValid())) return true;
	}
	if (parameterStudiesHaveWarning(parameterStudies)) return true;
	return false;
}

export interface ParameterStudyModalProps {
	parameterStudyMenus: ResieParameterMenuInfo[];
	setParameterStudyMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	parameterStudyOptions: InputObject[];
	parameterStudies: ParameterStudy[];
	setParameterStudies: Dispatch<SetStateAction<ParameterStudy[]>>;
}

export const ParameterStudyModal = ({
	show,
	setShow,
	parameterStudyMenus,
	setParameterStudyMenus,
	parameterStudies,
	setParameterStudies,
	parameterStudyOptions,
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

					{/** Parameter Study */}
					<Accordion.Item className="AccordionItem" value="Parameter Study">
						<Accordion.Header className="AccordionHeader">
							<Accordion.Trigger className="modal-header accordion-header-button">
								Parameter Study
								{parameterStudiesHaveWarning(parameterStudies) && '⚠️'}
								<i className="bi bi-chevron-down"></i>
							</Accordion.Trigger>
						</Accordion.Header>

						<Accordion.Content>
							{/** Parameter Study menu */}
							<ParameterStudyMenu
								parameterStudies={parameterStudies}
								setParameterStudies={setParameterStudies}
								parameterStudyOptions={parameterStudyOptions}
							/>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</Modal.Body>
		</Modal>
	);
};
