import { useState } from 'react';
import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu, { type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu from './NewNodeMenu';
import { DropdownDivider } from 'react-bootstrap';

type MenuType = 'mediums' | 'nodes' | 'import-export';

const Sidebar = (menuProps: ImportExportMenuProps & MediumMenuProps) => {
	const [selectedMenu, setSelectedMenu] = useState<MenuType>('nodes');

	const renderMenu = () => {
		switch (selectedMenu) {
			case 'mediums':
				return (
					<MediumMenu
						nodes={menuProps.nodes}
						setNodes={menuProps.setNodes}
						edges={menuProps.edges}
						setEdges={menuProps.setEdges}
					/>
				);
			case 'nodes':
				return <NewNodeMenu />;
			case 'import-export':
				return <ImportExportMenu {...menuProps} />;
			default:
				return null;
		}
	};

	return (
		<aside>
			<div className="sidebar-menu-section">
				<h3 className="sidebar-heading">Menus</h3>
				<div className="sidebar-menu-buttons">
					<button
						className={`sidebar-menu-btn ${selectedMenu === 'nodes' ? 'active' : ''}`}
						onClick={() => setSelectedMenu('nodes')}
					>
						Add New Components
					</button>
					<button
						className={`sidebar-menu-btn ${selectedMenu === 'mediums' ? 'active' : ''}`}
						onClick={() => setSelectedMenu('mediums')}
					>
						Mediums
					</button>
					<button
						className={`sidebar-menu-btn ${selectedMenu === 'import-export' ? 'active' : ''}`}
						onClick={() => setSelectedMenu('import-export')}
					>
						Import/Export
					</button>
				</div>
			</div>

			<DropdownDivider />
			<div className="sidebar-menu-content">{renderMenu()}</div>
		</aside>
	);
};

export default Sidebar;
