import { useContext } from 'react';
import { Col } from 'react-bootstrap';
import type { Medium } from '../../NodeDataStructures/Medium';
import MediumInputWidget from './MediumInputWidget';
import { AppContext } from '../../Reactflow-Components/AppContext';

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
			</Col>
		</>
	);
};

export default MediumMenu;
