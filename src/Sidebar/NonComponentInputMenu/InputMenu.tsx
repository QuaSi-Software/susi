import type { Dispatch, SetStateAction } from 'react';
import { NodeInput } from '../../NodeDataStructures/Nodes/NodeInput';
import RequiredInputMenu from '../../Reactflow-Components/Reactflow-Menus/EditNodeModal/InputMenu';
import OptionalInputMenu from '../../Reactflow-Components/Reactflow-Menus/EditNodeModal/OptionalInputField';

interface InputMenuProps {
	menuName: string;
	inputs: NodeInput[];
	setInputs: Dispatch<SetStateAction<NodeInput[]>>;
}

export const InputMenu = ({ menuName, inputs, setInputs }: InputMenuProps) => {
	let requiredInputs = inputs.filter((obj) => obj.isRequired);
	let optionalInputs = inputs.filter((obj) => !obj.isRequired);

	function onValueChange(inputName: string, value: any) {
		setInputs((inputs) => {
			const input = inputs.find((e) => e.resieName === inputName);
			input!.value = value;
			return inputs;
		});
	}
	function onIncludedChange(inputName: string, value: boolean) {
		setInputs((inputs) => {
			const input = inputs.find((e) => e.resieName === inputName);
			input!.isIncluded = value;
			return inputs;
		});
	}
	return (
		<>
			<div className="sidebar-heading">{menuName}</div>
			{requiredInputs.length > 0 && (
				<RequiredInputMenu requiredInputObjects={requiredInputs} onEdit={onValueChange} />
			)}
			{optionalInputs.length > 0 && (
				<OptionalInputMenu
					optionalInputObjects={optionalInputs}
					onValueChange={onValueChange}
					onIncludedChange={onIncludedChange}
				/>
			)}
		</>
	);
};
