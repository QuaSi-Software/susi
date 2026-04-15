import { MediumMenu, type MediumMenuProps } from './Mediums/MediumMenu';
import NewNodeMenu from './NewNodeMenu';

const Sidebar: React.FC<MediumMenuProps> = ({ mediums, setMediums }) => {
	return (
		<aside>
			<MediumMenu mediums={mediums} setMediums={setMediums} />
			<NewNodeMenu />
		</aside>
	);
};

export default Sidebar;
