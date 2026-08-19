import { useState, type Dispatch, type SetStateAction } from 'react';
import type { ResieParameterMenuInfo } from './ResieParameterMenuInfo';
import InputMenuWithCategories from '../../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';
import { Accordion } from 'radix-ui';
import _ from 'lodash';
import ComponentListWidget from '../../Reactflow-Components/CustomInputWidgets/ComponentListWidget';
import { InputObject, InputObjectType } from '../../Reactflow-Components/CustomInputWidgets/InputObject';

export interface ResieParametersMenuProps {
	selectedMenu?: string;
	resieParameterMenus: ResieParameterMenuInfo[];
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
}

export function ResieParametersMenu({
	selectedMenu,
	resieParameterMenus,
	setResieParameterMenus,
}: ResieParametersMenuProps) {
	function changeInputListElement(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		setResieParameterMenus((resieParameterMenuInfo) => {
			resieParameterMenuInfo = _.cloneDeep(resieParameterMenuInfo);
			const menu = resieParameterMenuInfo.find((e) => e.title === menuTitle);
			const input = menu!.inputs.find((e) => e.resieName === key);
			if (!input)
				console.error(`Input with key ${key} should not be undefined in list ${resieParameterMenuInfo}`);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			menu!.inputs.forEach((e) => {
				e.checkInputValid(menu!.inputs);
			});
			return resieParameterMenuInfo;
		});
	}

	const [test, setTest] = useState<string[]>([]);

	const menu = resieParameterMenus.find((e) => e.title === selectedMenu);
	return (
		<div key={`key-${selectedMenu}-menu`}>
			<div className="sidebar-subheading">{menu?.title}</div>
			<br />
			<Accordion.Root className="AccordionRoot" type="multiple" defaultValue={[menu!.categories[0].heading]}>
				<InputMenuWithCategories
					title={menu!.title}
					inputs={menu!.inputs}
					inputCategories={menu!.categories}
					nodeId={null}
					onValueChange={(key, value) => changeInputListElement(menu!.title, key, value, false)}
					onIncludedChange={(key, value) => changeInputListElement(menu!.title, key, value, true)}
				/>
				<ComponentListWidget
					nodeInput={
						new InputObject({
							type: InputObjectType.COMPONENT_UAC_LIST,
							resieName: 'test',
							displayName: 'Test',
							value: test,
						})
					}
					nodeId={null}
					onEdit={(resieName, newValue) => setTest(newValue)}
				/>
			</Accordion.Root>
		</div>
	);
}
