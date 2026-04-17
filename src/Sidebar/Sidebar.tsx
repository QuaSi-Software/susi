import MediumMenu, { type MediumMenuInput } from './Mediums/MediumMenu';
import NewNodeMenu from './NewNodeMenu';

const Sidebar = ({ nodes, setNodes }: MediumMenuInput) => {
	return (
		<aside>
			<MediumMenu nodes={nodes} setNodes={setNodes} />
			<NewNodeMenu />
		</aside>
	);
};

export default Sidebar;
