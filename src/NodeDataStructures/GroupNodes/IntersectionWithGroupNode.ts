import type { SusiNode } from '../Nodes/SusiNode';

function areIntersecting(A: SusiNode, G: SusiNode): boolean {
	const minOverlap = 10;
	const nodeWidth = A.measured?.width ?? 75;
	const nodeHeight = A.measured?.height ?? 75;

	const groupWidth = G.measured?.width ?? G.width;
	const groupHeight = G.measured?.height ?? G.height;
	console.assert(
		groupWidth !== undefined,
		`Group node ${G.data.content}: width is undefined, so intersection checking doesn't work.`
	);
	console.assert(
		groupHeight !== undefined,
		`Group node ${G.data.content}: height is undefined, so intersection checking doesn't work.`
	);

	/** min A larger than max B*/
	if (A.position.x - nodeWidth / 2 > G.position.x + groupWidth! / 2 - minOverlap) return false;
	if (A.position.y - nodeHeight / 2 > G.position.y + groupHeight! / 2 - minOverlap) return false;
	/** max A smaller than min B*/
	if (A.position.x + nodeWidth / 2 < G.position.x - groupWidth! / 2 + minOverlap) return false;
	if (A.position.y + nodeHeight / 2 < G.position.y - groupHeight! / 2 + minOverlap) return false;
	return true;
}

export function getIntersectionsWithGroupNode(_node: SusiNode, nodes: SusiNode[]): SusiNode[] {
	if (_node.type === 'group') return [];
	return nodes.filter((n) => {
		if (n.id === _node.id) return false;
		if (n.type !== 'group') return false;
		return areIntersecting(_node, n);
	});
}
