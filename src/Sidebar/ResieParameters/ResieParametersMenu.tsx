import { type Dispatch, type SetStateAction } from 'react';
import { isEconomicOrEmissionsParameter, type ResieParameterMenuInfo } from './ResieParameterMenuInfo';
import InputMenuWithCategories from '../../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';
import { Accordion } from 'radix-ui';
import _ from 'lodash';
import { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { checkEconomicAndEmissionsNodeValidInputs } from '../../NodeDataStructures/Nodes/ValidateSusiNode';

export interface ResieParametersMenuProps {
	resieParameterMenu: ResieParameterMenuInfo;
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
}

export function ResieParametersMenu({
	resieParameterMenu,
	setResieParameterMenus,
	setNodes,
}: ResieParametersMenuProps) {
	function changeInputListElement(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		/** The setState setResieParameterMenus must be used as a callback, because in this same frame, it may be called
		 * once to set the value and once to set isIncluded. If they don't use the setter callback, they may overwrite each other.
		 */
		setResieParameterMenus((resieParameterMenus) => {
			const newResieParametersMenus = _.cloneDeep(resieParameterMenus);
			const menu = newResieParametersMenus.find((e) => e.title === menuTitle);
			const input = menu!.inputs.find((e) => e.resieName === key);
			if (!input)
				console.error(`Input with key ${key} should not be undefined in list ${newResieParametersMenus}`);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			InputObject.checkInputsValid(menu!.inputs);
			if (isEconomicOrEmissionsParameter(menu!.exportKey, key)) {
				checkEconomicAndEmissionsNodeValidInputs(setNodes, newResieParametersMenus);
			}
			return newResieParametersMenus;
		});
	}

	const inputs = resieParameterMenu!.inputs.filter((e) => e.resieName !== 'start_date_format');
	return (
		<div key={`key-${resieParameterMenu.title}-menu`}>
			<div className="sidebar-subheading">{resieParameterMenu?.title}</div>
			<Accordion.Root
				className="AccordionRoot"
				type="multiple"
				defaultValue={[resieParameterMenu!.categories[0].heading]}
			>
				<InputMenuWithCategories
					title={resieParameterMenu!.title}
					inputs={inputs}
					inputCategories={resieParameterMenu!.categories}
					nodeId={null}
					onValueChange={(key, value) => changeInputListElement(resieParameterMenu!.title, key, value, false)}
					onIncludedChange={(key, value) =>
						changeInputListElement(resieParameterMenu!.title, key, value, true)
					}
				/>
			</Accordion.Root>
		</div>
	);
}
