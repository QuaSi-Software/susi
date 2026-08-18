import { useContext, useState } from 'react';
import { DropdownMenu } from 'radix-ui';
import '@radix-ui/colors/indigo.css';

import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu, { type NewNodeMenuProps } from './NewNodeMenu';
import { InstructionMenu } from './Instructions';
import { SettingsMenu, type SettingsMenuProps } from './SettingsMenu';
import { AppContext } from '../AppContext';
import { ResieParametersMenu, type ResieParametersMenuProps } from './ResieParameters/ResieParametersMenu';
import { ResieParameterSubMenu } from './ResieParameters/ResieParameterSubMenu';
import { InformationMenu } from './InformationMenu/InformationMenu';

export const MenuType = {
	NewNodeMenu: 'Add New Components',
	MediumMenu: 'Medium Menu',
	ResieParameters: 'Resie Parameters',
	ImportExportMenu: 'Import/Export',
	Instructions: 'Instructions',
	Settings: 'Settings',
	Information: 'Project Info',
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
			case MenuType.Information:
				return <InformationMenu theme={menuProps.theme} />;
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
				<DropdownMenu.Root
				//  open={true}
				>
					<DropdownMenu.Trigger asChild>
						<button className="IconButton" aria-label="Choose Sidebar Menu">
							<i className="bi bi-list"></i>
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content
							className="DropdownMenuContent"
							sideOffset={15}
							align="start"
							side="right"
						>
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
							{MenuItem(MenuType.Information)}
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
				<span className="sidebar-heading">{selectedMenu}</span>
			</div>
			<div className="sidebar-menu-content">{renderMenu()}</div>
		</aside>
	);
};

export default Sidebar;
