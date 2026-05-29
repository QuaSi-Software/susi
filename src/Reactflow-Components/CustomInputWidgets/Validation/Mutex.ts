import type { InputObject } from '../InputObject';
import { ConditionalOperator } from './Conditionals';
import { InputIssueType, type InputIssue } from './InputChecking';

function checkMutex(input: InputObject, otherInputs: InputObject[]): InputIssue | null {
	for (let i = 0; i < input.conditionals.length; i++) {
		const conditional = input.conditionals[i];
		if (conditional.operator !== ConditionalOperator.mutex) continue;
		const targetParameter = otherInputs.find(
			(targetInput) => targetInput.resieName === conditional.targetParameterName
		);
		console.assert(
			targetParameter !== undefined,
			`Conditional can't find parameter ${conditional.targetParameterName} on input ${input.resieName}`
		);
		if (targetParameter!.isIncluded) {
			return {
				issueType: InputIssueType.Mutex,
				message: `Input cannot be enabled if ${targetParameter!.displayName} is enabled`,
			};
		}
	}
	return null;
}

export default checkMutex;
