import { type Dispatch, type SetStateAction } from 'react';
import { isEconomicOrEmissionsParameter, type ResieParameterMenuInfo } from './ResieParameterMenuInfo';
import InputMenuWithCategories from '../../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';
import { Accordion } from 'radix-ui';
import _ from 'lodash';
import { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { checkEconomicAndEmissionsNodeValidInputs } from '../../NodeDataStructures/Nodes/ValidateSusiNode';

export interface ResieParametersMenuProps {
	selectedMenu?: string;
	resieParameterMenus: ResieParameterMenuInfo[];
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
}

export function ResieParametersMenu({
	selectedMenu,
	resieParameterMenus,
	setResieParameterMenus,
	setNodes,
}: ResieParametersMenuProps) {
	function changeInputListElement(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		const newResieParametersMenus = _.cloneDeep(resieParameterMenus);
		const menu = newResieParametersMenus.find((e) => e.title === menuTitle);
		const input = menu!.inputs.find((e) => e.resieName === key);
		if (!input) console.error(`Input with key ${key} should not be undefined in list ${newResieParametersMenus}`);
		if (isIncludedChange) input!.isIncluded = value;
		else input!.value = value;
		InputObject.checkInputsValid(menu!.inputs);
		setResieParameterMenus(newResieParametersMenus);
		if (isEconomicOrEmissionsParameter(menu!.exportKey, key)) {
			checkEconomicAndEmissionsNodeValidInputs(setNodes, newResieParametersMenus);
		}
	}

	const menu = resieParameterMenus.find((e) => e.title === selectedMenu);
	const inputs = menu!.inputs.filter((e) => e.resieName !== 'start_date_format');
	return (
		<div key={`key-${selectedMenu}-menu`}>
			<div className="sidebar-subheading">{menu?.title}</div>
			<Accordion.Root className="AccordionRoot" type="multiple" defaultValue={[menu!.categories[0].heading]}>
				<InputMenuWithCategories
					title={menu!.title}
					inputs={inputs}
					inputCategories={menu!.categories}
					nodeId={null}
					onValueChange={(key, value) => changeInputListElement(menu!.title, key, value, false)}
					onIncludedChange={(key, value) => changeInputListElement(menu!.title, key, value, true)}
				/>
			</Accordion.Root>
		</div>
	);
}
