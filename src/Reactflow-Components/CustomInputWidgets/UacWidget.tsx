import { useReactFlow } from '@xyflow/react';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import CustomDropdown from './CustomDropdown';

interface UacWidgetProps {
	displayName: string;
	onInputChanged: (newInput: any) => void;
	value: string;
	excludedNodeIds: string[];
}

export function UacWidget({ displayName, onInputChanged, value, excludedNodeIds }: UacWidgetProps) {
	const allNodes: SusiNode[] = useReactFlow()
		.getNodes()
		.filter((n) => n.type !== 'group') as SusiNode[];
	const nodeList = allNodes.filter((e) => !excludedNodeIds.includes(e.id));
	return (
		<CustomDropdown<string>
			displayName={displayName}
			startValue={value}
			dropdown_options={['None'].concat(nodeList.map((n: SusiNode) => n.id))}
			dropdown_options_display_names={['None'].concat(nodeList.map((n: SusiNode) => n.data.content))}
			onEdit={onInputChanged}
		/>
	);
}
