import { useContext } from 'react';
import { Col } from 'react-bootstrap';
import type { Medium } from '../../NodeDataStructures/Medium';
import MediumInputWidget from './MediumInputWidget';
import { AppContext } from '../../Reactflow-Components/AppContext';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import { NodeInputType } from '../../NodeDataStructures/NodeInput';
import { getDefaultMediums, getRandomColor } from './MediumUtils';

import _ from 'lodash';

export interface MediumMenuInput {
	nodes: NodeWithSusiData[];
	setNodes: (nodes: NodeWithSusiData[]) => void;
}

const MediumMenu = ({ nodes, setNodes }: MediumMenuInput) => {
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

	const onMediumDelete = (key: string) => {
		const newMediums = mediums.filter((m) => m.key !== key);
		const newNodes: NodeWithSusiData[] = Object.assign([], nodes);
		newNodes.forEach((node) => {
			node.data.nodeInputs.forEach((nodeInput) => {
				if (nodeInput.type === NodeInputType.MEDIUM && nodeInput.value === key) {
					nodeInput.value = 'UNDEFINED';
				}
			});
		});
		setNodes(newNodes);
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
		const newMediums = getDefaultMediums();
		setMediums(newMediums);
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
						medium.key !== 'UNDEFINED' && (
							<MediumInputWidget
								key={medium.key}
								medium={medium}
								onMediumChange={onMediumChange}
								onDelete={() => onMediumDelete(medium.key)}
							/>
						)
				)}
				<div className="medium-menu-button-section ">
					<button className="medium-menu-button" onClick={addMedium}>
						<i className="bi bi-plus-circle" /> Add new Medium
					</button>
					<button className="medium-menu-button" onClick={resetMenu} disabled={mediumsAreDefault()}>
						<i className="bi bi-arrow-clockwise" /> Reset Medium Menu
					</button>
				</div>
			</Col>
		</div>
	);
};

export default MediumMenu;
