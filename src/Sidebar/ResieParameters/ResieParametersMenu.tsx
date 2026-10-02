import { type Dispatch, type SetStateAction } from 'react';
import { changeInputListElement, type ResieParameterMenuInfo } from './ResieParameterMenuInfo';
import InputMenuWithCategories from '../../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';
import { Accordion } from 'radix-ui';
import _ from 'lodash';

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
	function updateMenu(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		changeInputListElement(setResieParameterMenus, menuTitle, key, value, isIncludedChange);
	}

	const menu = resieParameterMenus.find((e) => e.title === selectedMenu);
	const inputs = menu!.inputs.filter((e) => e.resieName !== 'start_end_unit');
	return (
		<div key={`key-${selectedMenu}-menu`}>
			<div className="sidebar-subheading">{menu?.title}</div>
			<Accordion.Root className="AccordionRoot" type="multiple" defaultValue={[menu!.categories[0].heading]}>
				<InputMenuWithCategories
					title={menu!.title}
					inputs={inputs}
					inputCategories={menu!.categories}
					nodeId={null}
					onValueChange={(key, value) => updateMenu(menu!.title, key, value, false)}
					onIncludedChange={(key, value) => updateMenu(menu!.title, key, value, true)}
				/>
			</Accordion.Root>
		</div>
	);
}
