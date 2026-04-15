import React from 'react';
import { Col } from 'react-bootstrap';
import type { Medium } from '../../NodeDataStructures/Medium';
import MediumInputWidget from './MediumInputWidget';

interface MediumMenuProps {
	mediums: Medium[];
	setMediums: (mediums: Medium[]) => void;
}

const MediumMenu: React.FC<MediumMenuProps> = ({ mediums, setMediums }) => {
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
				{mediums.map((medium) => (
					<MediumInputWidget
						key={medium.key}
						medium={medium}
						onMediumChange={onMediumChange}
						onDelete={() => onMediumDelete(medium.key)}
					/>
				))}
			</Col>
		</>
	);
};

export { MediumMenu, type MediumMenuProps };
