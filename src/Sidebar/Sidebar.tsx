import { useContext, useState, type Dispatch, type SetStateAction } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu, { type NewNodeMenuProps } from './NewNodeMenu';
import { DropdownDivider } from 'react-bootstrap';
import { InstructionMenu } from './Instructions';
import { SettingsMenu, type SettingsMenuProps } from './SettingsMenu';
import { AppContext } from '../AppContext';
import type { MenuInputs } from '../FetchingApiData/MenuInputs';
import InputMenuWithCategories from '../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';

export const MenuType = {
	NewNodeMenu: 'Add New Components',
	MediumMenu: 'Medium Menu',
	SimulationParameters: 'Simulation Parameters',
	IO_Settings: 'IO Settings',
	ImportExportMenu: 'Import/Export',
	Instructions: 'Instructions',
	Settings: 'Settings',
} as const;

export type MenuType = (typeof MenuType)[keyof typeof MenuType];

type SidebarProps = ImportExportMenuProps & MediumMenuProps & SettingsMenuProps & NewNodeMenuProps;

const Sidebar = (menuProps: SidebarProps) => {
	const [selectedMenu, setSelectedMenu] = useState<MenuType>(MenuType.NewNodeMenu);
	const mediums = useContext(AppContext)!.mediums;

	function changeInputListElement(
		key: string,
		value: any,
		setInput: Dispatch<SetStateAction<MenuInputs>>,
		isIncludedChange: boolean
	) {
		setInput((menuInputs) => {
			const input = menuInputs.inputs.find((e) => e.resieName === key);
			if (!input) console.error(`Input with key ${key} should not be undefined in list ${menuInputs}`);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			menuInputs.inputs.forEach((e) => {
				e.checkInputValid(menuInputs.inputs);
			});
			return menuInputs;
		});
	}

	const renderMenu = () => {
		switch (selectedMenu) {
			case MenuType.MediumMenu:
				return (
					<MediumMenu
						nodes={menuProps.nodes}
						setNodes={menuProps.setNodes}
						edges={menuProps.edges}
						setEdges={menuProps.setEdges}
					/>
				);
			case MenuType.NewNodeMenu:
				return <NewNodeMenu {...menuProps} />;
			case MenuType.ImportExportMenu:
				return <ImportExportMenu {...menuProps} />;
			case MenuType.SimulationParameters:
				return (
					<InputMenuWithCategories
						title="Simulation Parameters"
						inputs={menuProps.simulationParameters.inputs}
						inputCategories={menuProps.simulationParameters.categories}
						onValueChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setSimulationParameters, false)
						}
						onIncludedChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setSimulationParameters, true)
						}
						numberOfColumns={1}
						menuTypeName="Simulation Parameters"
					/>
				);
			case MenuType.IO_Settings:
				return (
					<InputMenuWithCategories
						title="IO Settings"
						inputs={menuProps.ioSettings.inputs}
						inputCategories={menuProps.ioSettings.categories}
						onValueChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setIOSettings, false)
						}
						onIncludedChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setIOSettings, true)
						}
						numberOfColumns={1}
						menuTypeName="IO Settings"
					/>
				);
			case MenuType.Instructions:
				return <InstructionMenu />;
			case MenuType.Settings:
				return <SettingsMenu {...menuProps} />;
			default:
				return null;
		}
	};

	function menuHasWarning(menuType: MenuType) {
		switch (menuType) {
			case MenuType.MediumMenu:
				const allMediumsValid = mediums.every((m) => m.valid);
				return !allMediumsValid;
			case MenuType.SimulationParameters:
				const simulationParamsValid = menuProps.simulationParameters.inputs.every((input) => input.isValid());
				return !simulationParamsValid;
			case MenuType.IO_Settings:
				const ioSettingsValid = menuProps.ioSettings.inputs.every((input) => input.isValid());
				return !ioSettingsValid;
			default:
				return false;
		}
	}

	return (
		<aside>
			<div className="sidebar-menu-section">
				<Accordion activeIndex={0}>
					<AccordionTab style={{ color: '#000' }} header="Menus" className="sidebar-heading">
						<div className="sidebar-menu-buttons">
							{Object.values(MenuType).map((menuType: MenuType) => (
								<button
									key={`sidebar-menu-button-${menuType}`}
									className={`sidebar-menu-btn ${selectedMenu === menuType ? 'active' : ''}`}
									onClick={() => setSelectedMenu(menuType)}
								>
									{menuType as string}
									{menuHasWarning(menuType) && <> ⚠️</>}
								</button>
							))}
						</div>
					</AccordionTab>
				</Accordion>
			</div>

			<DropdownDivider />
			<div className="sidebar-menu-content">{renderMenu()}</div>
		</aside>
	);
};

export default Sidebar;
