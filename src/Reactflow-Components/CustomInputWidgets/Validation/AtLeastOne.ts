import type { InputObject } from '../InputObject';
import { InputIssueType, type InputIssue } from './InputChecking';
import { ValidationTarget, type Validation } from './NumberValidation';

function checkAtLeastOne(validation: Validation, otherInputs: InputObject[]): InputIssue | null {
	if (validation.target !== ValidationTarget.AT_LEAST_ONE) {
		return null;
	}
	/** at least one of the parameters mentioned in validation.otherParameterNames has to be included*/
	const parameters = otherInputs.filter((input) => validation.otherParameterNames?.includes(input.resieName));
	/** atLeastOne = not every parameter is not included */
	const allDisabled = parameters.every((input) => !input.isIncluded);
	if (!allDisabled) return null;
	const message = `At least one of the following parameters must be included: ${JSON.stringify(parameters.map((x) => x.displayName))}`;
	return {
		issueType: InputIssueType.AtLeastOne,
		message: message,
	};
}

export default checkAtLeastOne;
