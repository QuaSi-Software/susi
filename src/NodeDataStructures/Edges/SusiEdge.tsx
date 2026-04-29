import type { Edge } from '@xyflow/react';

export class SusiEdgeData {
	mediumKey: string;

	constructor(mediumKey: string = '') {
		this.mediumKey = mediumKey;
	}
}

export type SusiEdge = Edge & { data: SusiEdgeData };
