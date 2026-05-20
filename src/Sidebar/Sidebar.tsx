import { useState, type Dispatch, type SetStateAction } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu from './NewNodeMenu';
import { DropdownDivider } from 'react-bootstrap';
import { InstructionMenu } from './Instructions';
import { SettingsMenu, type SettingsMenuProps } from './SettingsMenu';
import InputMenu from '../Reactflow-Components/CustomInputWidgets/InputMenu';
import { InputObject } from '../Reactflow-Components/CustomInputWidgets/InputObject';

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

type SidebarProps = ImportExportMenuProps & MediumMenuProps & SettingsMenuProps;

const Sidebar = (menuProps: SidebarProps) => {
	const [selectedMenu, setSelectedMenu] = useState<MenuType>(MenuType.NewNodeMenu);

	function changeInputListElement(
		key: string,
		value: any,
		setInputList: Dispatch<SetStateAction<InputObject[]>>,
		isIncludedChange: boolean
	) {
		setInputList((list) => {
			const input = list.find((e) => e.resieName === key);
			if (!input) console.error(`Input with key ${key} should not be undefined in list ${list}`);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			return list;
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
				return <NewNodeMenu />;
			case MenuType.ImportExportMenu:
				return <ImportExportMenu {...menuProps} />;
			case MenuType.SimulationParameters:
				return (
					<InputMenu
						title="Simulation Parameters"
						inputs={menuProps.simulationParametersList}
						onValueChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setSimulationParameters, false)
						}
						onIncludedChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setSimulationParameters, true)
						}
						numberOfColumns={1}
					/>
				);
			case MenuType.IO_Settings:
				return (
					<InputMenu
						title="IO Settings"
						inputs={menuProps.ioSettingsList}
						onValueChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setIOSettings, false)
						}
						onIncludedChange={(key, value) =>
							changeInputListElement(key, value, menuProps.setIOSettings, true)
						}
						numberOfColumns={1}
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
