import { useContext } from 'react';
import { Col, Button } from 'react-bootstrap';
import type { Medium } from '../../NodeDataStructures/Medium';
import MediumInputWidget from './MediumInputWidget';
import { AppContext } from '../../Reactflow-Components/AppContext';

const getRandomColor = () => {
	return `#${Math.floor(Math.random() * 0x1000000)
		.toString(16)
		.padStart(6, '0')}`;
};

const MediumMenu = () => {
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

	return (
		<>
			<div className="description">{'Mediums'}</div>
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
				<Button variant="secondary" size="sm" onClick={addMedium}>
					<i className="bi bi-plus-circle" /> Add new Medium
				</Button>
			</Col>
		</>
	);
};

export default MediumMenu;
