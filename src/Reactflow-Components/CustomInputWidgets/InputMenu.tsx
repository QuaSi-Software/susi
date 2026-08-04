import { Row, Col } from 'react-bootstrap';
import CustomInputField from './CustomInputField';
import type { InputObject } from './InputObject';
import React from 'react';
import OptionalInputField from './OptionalInputField';
import { InputIssueType } from './Validation/InputChecking';
import { Accordion } from 'radix-ui';

export interface InputMenuProps {
	title: string;
	inputs: InputObject[];
	onValueChange: (resieName: string, newValue: string | number | boolean) => void;
	onIncludedChange: (resieName: string, isIncluded: boolean) => void;
	numberOfColumns: number;
}

/**
 * Divide up the Node inputs into Lists that are displayed in one row
 * @param items_per_row how many input fields should there be in each row
 * @returns List of rows, each containing NodeInput items
 */
const chunk_into_rows = (inputs: InputObject[], items_per_row: number): (InputObject | null)[][] => {
	const rows: (InputObject | null)[][] = [];
	let current_row: Array<InputObject | null> = [];
	inputs.forEach((node_input) => {
		current_row.push(node_input);
		if (current_row.length === items_per_row) {
			rows.push(current_row);
			current_row = [];
		}
	});
	while (current_row.length < items_per_row) {
		current_row.push(null);
	}
	rows.push(current_row);
	return rows;
};

export const InputMenu: React.FC<InputMenuProps> = ({
	title,
	inputs,
	onValueChange,
	onIncludedChange,
	numberOfColumns,
}) => {
	if (inputs.length === 0) return <></>;
	const rows = chunk_into_rows(inputs, numberOfColumns);

	/**
	 * allConditionalsTrue is checked inside column, so the space where this input would be is reserved
	 * for it. Otherwise, all the inputs will move each time conditionals are enabled or disabled, causing
	 * a confusing experience.
	 */
	return (
		<Accordion.Item className="AccordionItem" value={title}>
			<Accordion.Header className="AccordionHeader">
				<Accordion.Trigger className="modal-header accordion-header-button">
					{title}
					<i className="bi bi-chevron-down"></i>
				</Accordion.Trigger>
			</Accordion.Header>

			<Accordion.Content>
				{rows.map((pair, pairIndex) => (
					<Row key={`Key-${pairIndex}`} className="g-2 mt-1 mt-md-0 input-menu-row">
						{pair.map((input, colIndex) => (
							<Col key={`menu-item-${pairIndex}-${colIndex}`} md>
								{input !== null && (
									<div
										key="warning-message-text"
										style={{
											visibility:
												input.issue.issueType === InputIssueType.Conditional
													? 'hidden'
													: 'visible',
											height: '100%',
										}}
										className="input-menu-column"
									>
										{input.isRequired && (
											<div className="required-input-row">
												<CustomInputField nodeInput={input} onEdit={onValueChange} />
											</div>
										)}
										{!input.isRequired && (
											<OptionalInputField
												key={input.resieName}
												nodeInput={input}
												onValueChange={onValueChange}
												startIncluded={input.isIncluded}
												onIncludedChange={onIncludedChange}
											/>
										)}
									</div>
								)}
							</Col>
						))}
					</Row>
				))}
			</Accordion.Content>
		</Accordion.Item>
	);
};
