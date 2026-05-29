import type { InputObject } from '../InputObject';
import { InputIssueType, type InputIssue } from './InputChecking';

const ConditionalOperator = {
	is: 'is',
	is_not: 'is_not',
	is_true: 'is_true',
	is_not_nothing: 'is_not_nothing',
	is_nothing: 'is_nothing',
	is_one_of: 'is_one_of',
	AND: 'AND',
	OR: 'OR',
	mutex: 'mutex',
} as const;

type ConditionalOperator = (typeof ConditionalOperator)[keyof typeof ConditionalOperator];

interface Conditional {
	targetParameterName?: string;
	operator: ConditionalOperator;
	value?: any;
}

function checkAllConditionals(conditionals: Conditional[], inputs: InputObject[]): InputIssue | null {
	let allConditionsMet = true;
	let operation: ConditionalOperator = ConditionalOperator.AND;
	conditionals.forEach((conditional) => {
		if (conditional.operator === ConditionalOperator.AND) {
			operation = ConditionalOperator.AND;
			return;
		}
		if (conditional.operator === ConditionalOperator.OR) {
			operation = ConditionalOperator.OR;
			return;
		}
		const conditionMet = checkConditional(conditional, inputs);
		switch (operation) {
			case ConditionalOperator.AND:
				allConditionsMet = allConditionsMet && conditionMet;
				break;
			case ConditionalOperator.OR:
				allConditionsMet = allConditionsMet || conditionMet;
				break;
			default:
				console.error('operation should be only AND or OR');
		}
		operation = ConditionalOperator.AND;
	});
	return allConditionsMet ? null : { issueType: InputIssueType.Conditional, warningMessage: '' };
}

function checkConditional(conditional: Conditional, inputs: InputObject[]): boolean {
	const targetParameter = inputs.find((input) => input.resieName === conditional.targetParameterName);
	console.assert(targetParameter !== undefined);
	const targetValue = targetParameter!.value;
	switch (conditional.operator) {
		case ConditionalOperator.is:
			return targetValue === conditional.value;
		case ConditionalOperator.is_not:
			return targetValue !== conditional.value;
		case ConditionalOperator.is_true:
			return targetValue;
		case ConditionalOperator.is_not_nothing:
			return targetValue !== null && targetValue !== undefined && targetParameter!.isIncluded;
		case ConditionalOperator.is_nothing:
			return targetValue === null || targetValue === undefined || !targetParameter!.isIncluded;
		case ConditionalOperator.is_one_of:
			console.assert(Array.isArray(conditional.value));
			return conditional.value.find((x: any) => x === targetValue) !== undefined;
		case ConditionalOperator.mutex:
			return true;
		default:
			console.error(`Conditional ${conditional.operator} has no relevant case`);
			return false;
	}
}

function importConditional(array: any[]): Conditional {
	if (array.length === 1) {
		const operator = array[0] as ConditionalOperator;
		console.assert(operator === ConditionalOperator.AND || operator === ConditionalOperator.OR);
		return { operator: operator };
	}
	return {
		targetParameterName: array[0],
		operator: array[1] as ConditionalOperator,
		value: array.length >= 3 ? array[2] : undefined,
	};
}

export { type Conditional, checkAllConditionals, importConditional };
