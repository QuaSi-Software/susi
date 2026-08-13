import type { InputMenuProps } from './AccordionInputMenu';
import CustomInputField from './CustomInputField';
import OptionalInputField from './OptionalInputField';
import { InputIssueType } from './Validation/InputChecking';

export const InputMenu = ({ inputs, onValueChange, onIncludedChange }: InputMenuProps) => {
	if (inputs.length === 0) return <></>;
	return (
		<div className="input-menu">
			{inputs.map((input, inputIndex) => (
				<div
					key={`input-item-${inputIndex}-${input.resieName}`}
					style={{
						visibility: input.issue.issueType === InputIssueType.Conditional ? 'hidden' : 'visible',
						height: '100%',
					}}
					className="input-menu-item"
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
			))}
		</div>
	);
};
