import type { Edge } from '@xyflow/react';

class SusiEdgeData {
	mediumKey: string;

	constructor(mediumKey: string = '') {
		this.mediumKey = mediumKey;
	}
}

type SusiEdge = Edge & { data: SusiEdgeData };

const EdgeType = {
	DEFAULT: 'default',
	STRAIGHT: 'straight',
	STEP: 'step',
	SMOOTHSTEP: 'smoothstep',
} as const;
type EdgeType = (typeof EdgeType)[keyof typeof EdgeType];

export { SusiEdgeData, type SusiEdge, EdgeType };
