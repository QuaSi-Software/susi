import type { ImportExportMenuProps } from './Import-Export/ImportExportMenu';
import ImportExportMenu from './Import-Export/ImportExportMenu';
import MediumMenu from './Mediums/MediumMenu';
import NewNodeMenu from './NewNodeMenu';

const Sidebar = (menuProps: ImportExportMenuProps) => {
	return (
		<aside>
			<MediumMenu nodes={menuProps.nodes} setNodes={menuProps.setNodes} />
			<div style={{ margin: '20px' }}></div>
			<NewNodeMenu />
			<ImportExportMenu {...menuProps} />
		</aside>
	);
};

export default Sidebar;
