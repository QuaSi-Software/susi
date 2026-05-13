import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type BusData from '../../../NodeDataStructures/Bus/BusData';
import BusConnectionMenu from '../../BusDataWidget/BusConnectionMenu';
import InputMenu from './InputMenu';

interface ResieInputMenuInput {
	node: SusiNode;
	nodes: SusiNode[];
	onValueChange: (key: string, value: any) => void;
	onIncludedChange: (key: string, isIncluded: boolean) => void;
	onBusDataChange: (busData: BusData) => void;
}

function ResieInputMenu({ node, nodes, onValueChange, onIncludedChange, onBusDataChange }: ResieInputMenuInput) {
	let nodeInputObjects = node.data.nodeInputs;

	return (
		<>
			<InputMenu
				title="Component Inputs"
				inputs={nodeInputObjects}
				onValueChange={onValueChange}
				onIncludedChange={onIncludedChange}
			/>
			<BusConnectionMenu node={node} nodes={nodes} onBusDataChange={onBusDataChange} />
		</>
	);
}

export default ResieInputMenu;
