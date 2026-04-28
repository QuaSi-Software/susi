import type { SusiNode } from '../../../NodeDataStructures/SusiNode';
import type BusData from '../../../NodeDataStructures/BusData';
import RequiredInputMenu from './RequiredInputMenu';
import OptionalInputMenu from './OptionalInputMenu';
import BusConnectionMenu from '../../BusDataWidget/BusConnectionMenu';

interface ResieInputMenuInput {
	node: SusiNode;
	nodes: SusiNode[];
	onValueChange: (key: string, value: any) => void;
	onIncludedChange: (key: string, isIncluded: boolean) => void;
	onBusDataChange: (busData: BusData) => void;
}

function ResieInputMenu({ node, nodes, onValueChange, onIncludedChange, onBusDataChange }: ResieInputMenuInput) {
	let nodeInputObjects = node.data.nodeInputs;
	let requiredInputs = nodeInputObjects.filter((obj) => obj.isRequired);
	let optionalInputs = nodeInputObjects.filter((obj) => !obj.isRequired);

	return (
		<>
			<RequiredInputMenu requiredInputObjects={requiredInputs} onEdit={onValueChange} />
			<OptionalInputMenu
				optionalInputObjects={optionalInputs}
				onValueChange={onValueChange}
				onIncludedChange={onIncludedChange}
			/>
			<BusConnectionMenu node={node} nodes={nodes} onBusDataChange={onBusDataChange} />
		</>
	);
}

export default ResieInputMenu;
