import { type Dispatch, type SetStateAction } from 'react';
import type { MenuInputs } from '../FetchingApiData/MenuInputs';
import InputMenuWithCategories from '../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';

export interface ResieParametersMenuProps {
	selectedMenu?: string;
	simulationMenus: MenuInputs[];
	setSimulationMenus: Dispatch<SetStateAction<MenuInputs[]>>;
}

export function ResieParametersMenu({ selectedMenu, simulationMenus, setSimulationMenus }: ResieParametersMenuProps) {
	function changeInputListElement(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		setSimulationMenus((menuInputs) => {
			const menu = simulationMenus.find((e) => e.title === menuTitle);
			const input = menu!.inputs.find((e) => e.resieName === key);
			if (!input) console.error(`Input with key ${key} should not be undefined in list ${menuInputs}`);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			menu!.inputs.forEach((e) => {
				e.checkInputValid(menu!.inputs);
			});
			return menuInputs;
		});
	}

	const menu = simulationMenus.find((e) => e.title === selectedMenu);
	return (
		<>
			<div className="sidebar-heading">{menu?.title}</div>
			<br />
			<InputMenuWithCategories
				title={menu!.title}
				inputs={menu!.inputs}
				inputCategories={menu!.categories}
				onValueChange={(key, value) => changeInputListElement(menu!.title, key, value, false)}
				onIncludedChange={(key, value) => changeInputListElement(menu!.title, key, value, true)}
				numberOfColumns={1}
				menuTypeName={menu!.title}
			/>
		</>
	);
}
