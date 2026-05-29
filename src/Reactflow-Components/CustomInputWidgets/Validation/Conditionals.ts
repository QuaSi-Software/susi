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

function checkAllConditionals(input: InputObject, inputs: InputObject[]): InputIssue | null {
	let allConditionsMet = true;
	let operation: ConditionalOperator = ConditionalOperator.AND;
	input.conditionals.forEach((conditional) => {
		if (conditional.operator === ConditionalOperator.AND) {
			operation = ConditionalOperator.AND;
			return;
		}
		if (conditional.operator === ConditionalOperator.OR) {
			operation = ConditionalOperator.OR;
			return;
		}
		const conditionMet = checkConditional(conditional, inputs, input.resieName);
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
	return allConditionsMet ? null : { issueType: InputIssueType.Conditional, message: '' };
}

function checkConditional(conditional: Conditional, inputs: InputObject[], inputName: string = ''): boolean {
	const targetParameter = inputs.find((input) => input.resieName === conditional.targetParameterName);
	console.assert(
		targetParameter !== undefined,
		`Conditional can't find parameter ${conditional.targetParameterName} on input ${inputName}`
	);
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
			console.assert(
				Array.isArray(conditional.value),
				`Conditional operator is 'is_one_of', but its value is not an array: ${conditional.value}`
			);
			return conditional.value.find((x: any) => x === targetValue) !== undefined;
		case ConditionalOperator.mutex:
			return true;
		default:
			console.error(`Conditional ${conditional.operator} has no relevant case`);
			return false;
	}
}

function importConditional(importConditional: any): Conditional {
	if (!Array.isArray(importConditional)) {
		const operator = importConditional as ConditionalOperator;
		console.assert(
			operator === ConditionalOperator.AND || operator === ConditionalOperator.OR,
			`conditional import is not an array, but its value is not 'AND' or 'OR': ${importConditional}`
		);
		return { operator: operator };
	}
	return {
		targetParameterName: importConditional[0],
		operator: importConditional[1] as ConditionalOperator,
		value: importConditional.length >= 3 ? importConditional[2] : undefined,
	};
}

export { type Conditional, checkAllConditionals, importConditional };
