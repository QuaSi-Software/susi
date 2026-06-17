import { useContext, useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';

import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu, { type NewNodeMenuProps } from './NewNodeMenu';
import { DropdownDivider } from 'react-bootstrap';
import { InstructionMenu } from './Instructions';
import { SettingsMenu, type SettingsMenuProps } from './SettingsMenu';
import { AppContext } from '../AppContext';
import { SimulationSettingsMenu, type SimulationSettingsMenuProps } from './SimulationSettingsMenu';

export const MenuType = {
	NewNodeMenu: 'Add New Components',
	MediumMenu: 'Medium Menu',
	SimulationSettings: 'Simulation Settings',
	ImportExportMenu: 'Import/Export',
	Instructions: 'Instructions',
	Settings: 'Settings',
} as const;

export type MenuType = (typeof MenuType)[keyof typeof MenuType];

type SidebarProps = ImportExportMenuProps &
	MediumMenuProps &
	SettingsMenuProps &
	NewNodeMenuProps &
	SimulationSettingsMenuProps;

const Sidebar = (menuProps: SidebarProps) => {
	const [selectedMenu, setSelectedMenu] = useState<MenuType>(MenuType.NewNodeMenu);
	const mediums = useContext(AppContext)!.mediums;

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
			case MenuType.SimulationSettings:
				return <SimulationSettingsMenu {...menuProps} />;
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
			case MenuType.SimulationSettings:
				const simulationParamsValid = menuProps.simulationMenus.every((menu) => {
					return menu.inputs.every((input) => input.isValid());
				});
				return !simulationParamsValid;
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
