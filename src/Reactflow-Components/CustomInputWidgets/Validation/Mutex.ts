import { InputObject } from '../InputObject';
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

function mutexSolver(inputs: InputObject[], logError?: (msg: string) => void, nodeName?: string) {
	inputs.forEach((input) => {
		/** If this input is included and mutex, uninclude it */
		if (input.isIncluded && input.issue.issueType === InputIssueType.Mutex) {
			input.isIncluded = false;
			if (logError)
				logError(
					`On Component ${nodeName}, input ${input.displayName} was disabled, because ${input.issue.message}`
				);
		}
	});
	InputObject.checkInputsValid(inputs);
}

export { mutexSolver, checkMutex };
