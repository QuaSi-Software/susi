import type { InputObject } from './InputObject';

const ValidationTarget = {
	SELF: 'self',
	AT_LEAST_ONE: 'at_least_one',
};
type ValidationTarget = (typeof ValidationTarget)[keyof typeof ValidationTarget];

const ValidationOperator = {
	GREATER_EQUAL_ONE: 'at_least_one',
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
}
function getValidationComparisonValue(validation: Validation, otherInputs: InputObject[]) {
	switch (validation.operator) {
		case ValidationOperator.LESS_THAN_OTHER_INPUT:
		case ValidationOperator.LESS_EQUAL_THAN_OTHER_INPUT:
		case ValidationOperator.GREATER_THAN_OTHER_INPUT:
		case ValidationOperator.GREATER_EQUAL_THAN_OTHER_INPUT:
			const otherInput = otherInputs.find((input) => input.resieName === validation.otherInputName);
			return otherInput?.value;
		case ValidationOperator.GREATER_EQUAL_ONE:
			return 1;
		default:
			return validation.value;
	}
}
function isValid(value: number, validation: Validation, otherInputs: InputObject[]): boolean {
	const other = getValidationComparisonValue(validation, otherInputs);
	switch (validation.operator) {
		case ValidationOperator.GREATER_EQUAL_ONE:
			return value >= 1;
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
	}
}
function getValidationMessage(validation: Validation) {
	let message = '';
	switch (validation.operator) {
		case ValidationOperator.GREATER_EQUAL_ONE:
			return 'Value must be greater than 1.';
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
	const isNumber = typeof value === 'number';
	return {
		target,
		operator,
		value: isNumber ? value : undefined,
		otherInputName: !isNumber ? value : undefined,
	};
}

export { type Validation, ValidationOperator, ValidationTarget, importValidation, isValid, getValidationMessage };
