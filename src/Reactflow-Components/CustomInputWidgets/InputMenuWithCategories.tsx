import type { ApiCategory } from '../../FetchingApiData/ApiData';
import { type InputMenuProps, InputMenu } from './InputMenu';

type Props = InputMenuProps & { inputCategories: ApiCategory[] };

export default function InputMenuWithCategories(props: Props) {
	function getInputsInCategory(category: ApiCategory) {
		return category.parameters!.map((parameterName) => {
			const allInputs = props.inputs;
			return allInputs.find((input) => input.resieName === parameterName)!;
		});
	}
	return (
		<>
			{props.inputCategories.map((category) => (
				<InputMenu
					{...props}
					title={category.heading}
					inputs={getInputsInCategory(category)}
					key={category.heading}
				/>
			))}
		</>
	);
}
