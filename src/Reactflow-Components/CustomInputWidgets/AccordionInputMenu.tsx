import type { InputObject } from './InputObject';
import React from 'react';
import { Accordion } from 'radix-ui';
import { InputMenu } from './InputMenu';

export interface InputMenuProps {
	title: string;
	inputs: InputObject[];
	onValueChange: (resieName: string, newValue: string | number | boolean) => void;
	onIncludedChange: (resieName: string, isIncluded: boolean) => void;
}

export const AccordionInputMenu: React.FC<InputMenuProps> = ({ title, inputs, onValueChange, onIncludedChange }) => {
	if (inputs.length === 0) return <></>;

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
				<InputMenu
					title={title}
					inputs={inputs}
					onValueChange={onValueChange}
					onIncludedChange={onIncludedChange}
				/>
			</Accordion.Content>
		</Accordion.Item>
	);
};
