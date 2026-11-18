import { useContext, useState } from 'react';
import { DropdownMenu } from 'radix-ui';
import '@radix-ui/colors/indigo.css';

import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu, { type NewNodeMenuProps } from './NewNodeMenu';
import { AppContext } from '../AppContext';
import { ResieParametersMenu } from './ResieParameters/ResieParametersMenu';
import type { ResieParameterMenuInfo } from './ResieParameters/ResieParameterMenuInfo';
import { CustomModal } from '../Modals/CustomModal';

export const MenuType = {
	NewNodeMenu: 'Add Components',
	MediumMenu: 'Medium Menu',
	ImportExportMenu: 'Import/Export',
} as const;

export type MenuType = (typeof MenuType)[keyof typeof MenuType];

type SidebarProps = ImportExportMenuProps & MediumMenuProps & NewNodeMenuProps;

const Sidebar = (menuProps: SidebarProps) => {
	if (menuProps.resieParameterMenus.length === 0) return <></>;
	const [selectedMenu, setSelectedMenu] = useState<MenuType>(MenuType.NewNodeMenu);
	const [selectedResieMenuKey, setSelectedResieMenuKey] = useState<string>();
	const selectedResieMenu = menuProps.resieParameterMenus.find((e) => e.exportKey === selectedResieMenuKey);

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
							{MenuItem(MenuType.ImportExportMenu)}
							{/** Add all the Resie Parameter Menus to the dropdown options */}
							{menuProps.resieParameterMenus.map((menu: ResieParameterMenuInfo) => (
								<DropdownMenu.Item
									className="DropdownMenuItem"
									onSelect={() => setSelectedResieMenuKey(menu.exportKey)}
									key={menu.title}
								>
									{menu.title}
									{!menu.inputs.every((input) => input.isValid()) && <> ⚠️</>}
								</DropdownMenu.Item>
							))}
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
				<span className="sidebar-heading">{selectedMenu}</span>
			</div>
			<div className="sidebar-menu-content">{renderMenu()}</div>
			{selectedResieMenu !== undefined && (
				<CustomModal
					title={selectedResieMenu?.title ?? ''}
					show={selectedResieMenu !== undefined}
					closeModal={() => setSelectedResieMenuKey(undefined)}
				>
					<ResieParametersMenu
						resieParameterMenu={selectedResieMenu}
						setResieParameterMenus={menuProps.setResieParameterMenus}
						setNodes={menuProps.setNodes}
					/>
				</CustomModal>
			)}
		</aside>
	);
};

export default Sidebar;
