import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { SusiNode } from './SusiNode';

const ComponentInputType = {
	PARAMETER: 'PARAMETER',
	ECONOMIC: 'ECONOMIC',
	EMISSIONS: 'EMISSIONS',
} as const;
type ComponentInputType = (typeof ComponentInputType)[keyof typeof ComponentInputType];

function getInputs(componentInputType: ComponentInputType, node: SusiNode): InputObject[] {
	switch (componentInputType) {
		case ComponentInputType.PARAMETER:
			return node.data.nodeInputs;
		case ComponentInputType.ECONOMIC:
			return node.data.economicInputs;
		case ComponentInputType.EMISSIONS:
			return node.data.emissionsInputs;
	}
}

function assignInputs(componentInputType: ComponentInputType, node: SusiNode, inputs: InputObject[]): void {
	switch (componentInputType) {
		case ComponentInputType.PARAMETER:
			node.data.nodeInputs = inputs;
			break;
		case ComponentInputType.ECONOMIC:
			node.data.economicInputs = inputs;
			break;
		case ComponentInputType.EMISSIONS:
			node.data.emissionsInputs = inputs;
			break;
	}
}

export { ComponentInputType, getInputs, assignInputs };
