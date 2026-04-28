import { useContext } from 'react';
import { Button, Col } from 'react-bootstrap';
import type { Medium } from '../../NodeDataStructures/Medium';
import MediumInputWidget from './MediumInputWidget';
import { AppContext } from '../../Reactflow-Components/AppContext';
import { deepCloneNodes, type NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import { NodeInputType } from '../../NodeDataStructures/NodeInput';
import { getDefaultMediums, getRandomColor, getUndefinedMedium } from './MediumUtils';
import _ from 'lodash';
import type { SusiEdge } from '../../NodeDataStructures/SusiEdgeData';
import { flushSync } from 'react-dom';

export interface MediumMenuProps {
	nodes: NodeWithSusiData[];
	setNodes: (nodes: NodeWithSusiData[]) => void;
	edges: SusiEdge[];
	setEdges: (edges: SusiEdge[]) => void;
}

const MediumMenu = ({ nodes, setNodes, edges, setEdges }: MediumMenuProps) => {
	const context = useContext(AppContext);
	if (!context) return <></>;
	const mediums = context.mediums;
	const setMediums = context.setMediums;

	const onMediumChange = (medium: Medium) => {
		const mediumIndex = mediums.findIndex((m) => m.key === medium.key);
		const newMediums = JSON.parse(JSON.stringify(mediums));
		newMediums[mediumIndex] = medium;
		setMediums(newMediums);
	};

	const updateNodesAndEdgesOnMediumDelete = (mediumKeys: string[]) => {
		/** set the the medium variables to undefined
		 * that were previously one of the medium keys we're deleting */
		const newNodes: NodeWithSusiData[] = deepCloneNodes(nodes);
		mediumKeys.forEach((mediumKey) => {
			newNodes.forEach((node) => {
				node.data.nodeInputs.forEach((nodeInput) => {
					if (nodeInput.type === NodeInputType.MEDIUM && nodeInput.value === mediumKey) {
						nodeInput.value = getUndefinedMedium().key;
					}
				});
			});
		});
		setNodes(newNodes);
		const newEdges = edges.filter((e) => !mediumKeys.includes(e.data.mediumKey));
		setEdges(newEdges);
	};
	const onMediumDelete = (key: string) => {
		const newMediums = mediums.filter((m) => m.key !== key);
		flushSync(() => {
			updateNodesAndEdgesOnMediumDelete([key]);
		});
		setMediums(newMediums);
	};
	const addMedium = () => {
		const newMedium: Medium = {
			name: 'm_untitled',
			key: `m_${new Date().getTime()}`,
			color: getRandomColor(),
		};
		const newMediums = Object.assign([], mediums);
		newMediums.push(newMedium);
		setMediums(newMediums);
	};
	const resetMenu = () => {
		const defaultMediums = getDefaultMediums();
		const mediumsToDelete = mediums.filter((oldMedium) => {
			const defaultMediumWithSameKey = defaultMediums.find((m) => m.key === oldMedium.key);
			return defaultMediumWithSameKey === undefined;
		});
		const mediumsKeys = mediumsToDelete.map((m) => m.key);
		flushSync(() => updateNodesAndEdgesOnMediumDelete(mediumsKeys));
		setMediums(defaultMediums);
	};

	const mediumsAreDefault = () => {
		const newMediums = getDefaultMediums();
		return _.isEqual(newMediums, mediums);
	};

	return (
		<div className="medium-menu">
			<div className="sidebar-heading">{'Mediums'}</div>
			<Col className="d-flex flex-column gap-2">
				{mediums.map(
					(medium) =>
						medium.key !== getUndefinedMedium().key && (
							<MediumInputWidget
								key={medium.key}
								medium={medium}
								onMediumChange={onMediumChange}
								onDelete={() => onMediumDelete(medium.key)}
							/>
						)
				)}
				<div className="medium-menu-button-section ">
					<Button variant="primary" className="medium-menu-button" onClick={addMedium}>
						<i className="bi bi-plus-circle" /> Add new Medium
					</Button>
					<Button
						variant="primary"
						className="medium-menu-button"
						onClick={resetMenu}
						disabled={mediumsAreDefault()}
					>
						<i className="bi bi-arrow-clockwise" /> Reset Medium Menu
					</Button>
				</div>
			</Col>
		</div>
	);
};

export default MediumMenu;
