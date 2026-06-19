import { useContext, useState } from 'react';
// import { Accordion, AccordionTab } from 'primereact/accordion';
import { DropdownMenu } from 'radix-ui';
// import { HamburgerMenuIcon, DotFilledIcon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu, { type NewNodeMenuProps } from './NewNodeMenu';
import { DropdownDivider } from 'react-bootstrap';
import { InstructionMenu } from './Instructions';
import { SettingsMenu, type SettingsMenuProps } from './SettingsMenu';
import { AppContext } from '../AppContext';
import { ResieParametersMenu, type ResieParametersMenuProps } from './ResieParameters/ResieParametersMenu';
import { ResieParameterSubMenu } from './ResieParameters/ResieParameterSubMenu';

export const MenuType = {
	NewNodeMenu: 'Add New Components',
	MediumMenu: 'Medium Menu',
	ResieParameters: 'Resie Parameters',
	ImportExportMenu: 'Import/Export',
	Instructions: 'Instructions',
	Settings: 'Settings',
} as const;

export type MenuType = (typeof MenuType)[keyof typeof MenuType];

type SidebarProps = ImportExportMenuProps &
	MediumMenuProps &
	SettingsMenuProps &
	NewNodeMenuProps &
	ResieParametersMenuProps;

const Sidebar = (menuProps: SidebarProps) => {
	if (menuProps.resieParameterMenus.length === 0) return <></>;
	const [selectedMenu, setSelectedMenu] = useState<MenuType>(MenuType.NewNodeMenu);
	const [selectedResieParamMenu, setSelectedResieParamMenu] = useState(menuProps.resieParameterMenus[0].title);
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
			case MenuType.ResieParameters:
				return <ResieParametersMenu {...menuProps} selectedMenu={selectedResieParamMenu} />;
			case MenuType.Instructions:
				return <InstructionMenu />;
			case MenuType.Settings:
				return <SettingsMenu {...menuProps} />;
			default:
				return null;
		}
	};
	function MenuItem(menuType: MenuType, hasWarning: boolean = false) {
		return (
			<DropdownMenu.Item className="DropdownMenuItem" onClick={() => setSelectedMenu(menuType)}>
				{menuType as string}
				{hasWarning && <> ⚠️</>}
			</DropdownMenu.Item>
		);
	}

	return (
		<aside>
			<div className="sidebar-menu-section">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button className="IconButton" aria-label="Choose Sidebar Menu">
							Menus
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
							{MenuItem(MenuType.NewNodeMenu)}
							{MenuItem(MenuType.MediumMenu, !mediums.every((m) => m.valid))}
							<ResieParameterSubMenu
								resieParameterMenu={selectedResieParamMenu}
								setResieParameterMenu={setSelectedResieParamMenu}
								setSelectedMenu={setSelectedMenu}
								resieParameterMenus={menuProps.resieParameterMenus}
							/>
							{MenuItem(MenuType.ImportExportMenu)}
							{MenuItem(MenuType.Instructions)}
							{MenuItem(MenuType.Settings)}
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</div>

			<DropdownDivider />
			<div className="sidebar-menu-content">{renderMenu()}</div>
		</aside>
	);
};

export default Sidebar;
