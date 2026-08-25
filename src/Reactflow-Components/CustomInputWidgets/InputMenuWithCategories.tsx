import type { ApiCategory } from '../../FetchingApiData/ApiData';
import { type InputMenuProps, AccordionInputMenu } from './AccordionInputMenu';
import type { InputObject } from './InputObject';

type Props = InputMenuProps & { inputCategories: ApiCategory[] };

export default function InputMenuWithCategories(props: Props) {
	function getInputsInCategory(category: ApiCategory): InputObject[] {
		const inputs = category.parameters!.map((parameterName) => {
			const allInputs = props.inputs;
			const input = allInputs.find((input) => input.resieName === parameterName);
			return input!;
		});
		return inputs.filter((input) => input !== undefined);
	}
	return (
		<>
			{props.inputCategories.map((category) => (
				<AccordionInputMenu
					{...props}
					title={category.heading}
					inputs={getInputsInCategory(category)}
					key={category.heading}
				/>
			))}
		</>
	);
}
