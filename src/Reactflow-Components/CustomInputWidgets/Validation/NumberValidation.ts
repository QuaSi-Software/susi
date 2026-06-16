import { InputObjectType, type InputObject } from '../InputObject';
import { InputIssueType, type InputIssue } from './InputChecking';

const ValidationTarget = {
	SELF: 'self',
	AT_LEAST_ONE: 'at_least_one',
};
type ValidationTarget = (typeof ValidationTarget)[keyof typeof ValidationTarget];

const ValidationOperator = {
	LESS_THAN: 'value_lt_num',
	LESS_OR_EQUAL_THAN: 'value_lte_num',
	LESS_THAN_OR_NULL: 'value_lt_num_or_nothing',
	LESS_OR_EQUAL_OR_NULL: 'value_lte_num_or_nothing',
	GREATER_THAN: 'value_gt_num',
	GREATER_EQUAL: 'value_gte_num',
	GREATER_OR_NULL: 'value_gt_num_or_nothing',
	GREATER_EQUAL_OR_NULL: 'value_gte_num_or_nothing',
	LESS_THAN_OTHER_INPUT: 'value_lt_rel',
	LESS_EQUAL_THAN_OTHER_INPUT: 'value_lte_rel',
	GREATER_THAN_OTHER_INPUT: 'value_gt_rel',
	GREATER_EQUAL_THAN_OTHER_INPUT: 'value_gte_rel',
} as const;

type ValidationOperator = (typeof ValidationOperator)[keyof typeof ValidationOperator];

interface Validation {
	target: ValidationTarget;
	operator: ValidationOperator;
	value?: number;
	otherInputName?: string;
	otherParameterNames?: string[];
}

function checkNumberValidation(input: InputObject, otherInputs: InputObject[]): InputIssue | null {
	if (!input.isIncluded) return null;
	const isNumberInput = input.type === InputObjectType.FLOAT || input.type === InputObjectType.INT;
	const parsedValue = Number.parseFloat(input.value);
	if (isNumberInput && Number.isNaN(parsedValue)) {
		return {
			issueType: InputIssueType.Validity,
			message: `Value must be a number`,
		};
	}
	if (input.type === InputObjectType.INT && !Number.isInteger(parsedValue)) {
		return {
			issueType: InputIssueType.Validity,
			message: `Value must be an integer`,
		};
	}
	for (let i = 0; i < input.validations.length; i++) {
		const validation = input.validations[i];
		if (!isValid(input, validation, otherInputs)) {
			return {
				issueType: InputIssueType.Validity,
				message: getValidationMessage(validation),
			};
		}
	}
	return null;
}

function getValidationComparisonValue(validation: Validation, otherInputs: InputObject[], inputType: string) {
	switch (validation.operator) {
		case ValidationOperator.LESS_THAN_OTHER_INPUT:
		case ValidationOperator.LESS_EQUAL_THAN_OTHER_INPUT:
		case ValidationOperator.GREATER_THAN_OTHER_INPUT:
		case ValidationOperator.GREATER_EQUAL_THAN_OTHER_INPUT:
			const otherInput = otherInputs.find((input) => input.resieName === validation.otherInputName);
			console.assert(
				otherInput !== undefined,
				`Validation in ${inputType} cannot find input with name ${validation.otherInputName}`
			);
			return otherInput?.value;
		default:
			return validation.value;
	}
}
function isValid(input: InputObject, validation: Validation, otherInputs: InputObject[]): boolean {
	const value = input.value;
	const other = getValidationComparisonValue(validation, otherInputs, input.resieName);
	switch (validation.operator) {
		case ValidationOperator.LESS_THAN:
		case ValidationOperator.LESS_THAN_OR_NULL:
		case ValidationOperator.LESS_THAN_OTHER_INPUT:
			return value < other;
		case ValidationOperator.LESS_OR_EQUAL_THAN:
		case ValidationOperator.LESS_OR_EQUAL_OR_NULL:
		case ValidationOperator.LESS_EQUAL_THAN_OTHER_INPUT:
			return value <= other;
		case ValidationOperator.GREATER_THAN:
		case ValidationOperator.GREATER_OR_NULL:
		case ValidationOperator.GREATER_THAN_OTHER_INPUT:
			return value > other;
		case ValidationOperator.GREATER_EQUAL:
		case ValidationOperator.GREATER_EQUAL_OR_NULL:
		case ValidationOperator.GREATER_EQUAL_THAN_OTHER_INPUT:
			return value >= other;
		default:
			return true;
	}
}
function getValidationMessage(validation: Validation): string {
	let message = '';
	switch (validation.operator) {
		case ValidationOperator.LESS_THAN:
		case ValidationOperator.LESS_THAN_OR_NULL:
		case ValidationOperator.LESS_THAN_OTHER_INPUT:
			message += 'Value must be less than ';
			break;
		case ValidationOperator.LESS_OR_EQUAL_THAN:
		case ValidationOperator.LESS_OR_EQUAL_OR_NULL:
		case ValidationOperator.LESS_EQUAL_THAN_OTHER_INPUT:
			message += 'Value must be less than or equal to ';
			break;
		case ValidationOperator.GREATER_THAN:
		case ValidationOperator.GREATER_OR_NULL:
		case ValidationOperator.GREATER_THAN_OTHER_INPUT:
			message += 'Value must be greater than ';
			break;
		case ValidationOperator.GREATER_EQUAL:
		case ValidationOperator.GREATER_EQUAL_OR_NULL:
		case ValidationOperator.GREATER_EQUAL_THAN_OTHER_INPUT:
			message += 'Value must be greater than or equal to ';
	}
	switch (validation.operator) {
		case ValidationOperator.LESS_THAN_OTHER_INPUT:
		case ValidationOperator.LESS_EQUAL_THAN_OTHER_INPUT:
		case ValidationOperator.GREATER_THAN_OTHER_INPUT:
		case ValidationOperator.GREATER_EQUAL_THAN_OTHER_INPUT:
			return (message += 'value in ' + validation.otherInputName);
		default:
			return (message += validation.value);
	}
}

function importValidation(importValidation: (string | number)[]): Validation {
	const target: ValidationTarget = importValidation[0] as ValidationTarget;
	const operator: ValidationOperator = importValidation[1] as ValidationOperator;
	const value: number | string = importValidation[2];
	const result: Validation = {
		target,
		operator,
	};
	if (target === ValidationTarget.AT_LEAST_ONE) {
		result.otherParameterNames = importValidation.slice(1).map((x) => String(x));
	}
	if (typeof value === 'number') result.value = value;
	else result.otherInputName = value;
	return result;
}

export { type Validation, ValidationOperator, ValidationTarget, importValidation, checkNumberValidation };
