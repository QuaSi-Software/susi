import { useState, type Dispatch, type SetStateAction } from 'react';
import type { MenuInputs } from '../FetchingApiData/MenuInputs';
import CustomDropdown from '../Reactflow-Components/CustomInputWidgets/CustomDropdown';
import { DropdownDivider } from 'react-bootstrap';
import InputMenuWithCategories from '../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';

export interface SimulationSettingsMenuProps {
	simulationMenus: MenuInputs[];
	setSimulationMenus: Dispatch<SetStateAction<MenuInputs[]>>;
}

export function SimulationSettingsMenu({ simulationMenus, setSimulationMenus }: SimulationSettingsMenuProps) {
	const menuNames = simulationMenus.map((menu) => menu.title);
	const [selectedMenu, setSelectedMenu] = useState<string>(menuNames[0]);

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
			<CustomDropdown
				displayName="Simulation Settings Menus"
				startValue={selectedMenu}
				dropdown_options={menuNames}
				onEdit={setSelectedMenu}
			/>
			<br />
			<DropdownDivider />
			<div className="sidebar-heading">{menu?.title}</div>
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
