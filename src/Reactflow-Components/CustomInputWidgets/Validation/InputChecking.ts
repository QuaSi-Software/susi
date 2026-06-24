import { InputObjectType, type InputObject } from '../InputObject';
import checkAtLeastOne from './AtLeastOne';
import { checkAllConditionals } from './Conditionals';
import { checkMutex } from './Mutex';
import { checkNumberValidation } from './NumberValidation';

const InputIssueType = {
	None: 'NONE',
	Validity: 'VALIDITY',
	Conditional: 'CONDITIONAL',
	AtLeastOne: 'AT_LEAST_ONE',
	Mutex: 'Mutex',
} as const;

type InputIssueType = (typeof InputIssueType)[keyof typeof InputIssueType];

interface InputIssue {
	issueType: InputIssueType;
	message: string;
}

function checkForInputIssues(input: InputObject, otherInputs: InputObject[]): InputIssue {
	/** First: check for conditionals not being met */
	const conditionalsMet = checkAllConditionals(input, otherInputs);
	if (conditionalsMet) {
		// if (!input.isRequired) input.isIncluded = false;
		return conditionalsMet;
	}
	/** check mutex next */
	const mutex = checkMutex(input, otherInputs);
	if (mutex) return mutex;
	/** check for at least one */
	for (let i = 0; i < input.validations.length; i++) {
		const validation = input.validations[i];
		const atLeastOne = checkAtLeastOne(validation, otherInputs);
		if (atLeastOne) return atLeastOne;
	}
	/** check for invalid number inputs */
	const numberIssue = checkNumberValidation(input, otherInputs);
	if (numberIssue) return numberIssue;
	/** Check valid array or object string */
	const parseIssue = checkObjectsAndArrays(input);
	if (parseIssue) return parseIssue;
	/** if no issues were found, return null */
	return { issueType: InputIssueType.None, message: '' };
}

function checkObjectsAndArrays(input: InputObject): InputIssue | null {
	if (!input.isIncluded) return null;
	const shouldBeArray = input.type === InputObjectType.VECTOR_FLOAT || input.type === InputObjectType.VECTOR_STRING;
	const shouldBeObject = input.type === InputObjectType.CUSTOM_OBJECT;
	if (shouldBeArray || shouldBeObject) {
		/** Check that they are valid JSON objects */
		let obj;
		try {
			obj = JSON.parse(input.value);
		} catch (error) {
			obj = null;
		}
		if (shouldBeArray && (obj === null || !Array.isArray(obj))) {
			return {
				issueType: InputIssueType.Validity,
				message: `Input is not an array`,
			};
		} else if (shouldBeObject && (obj === null || Array.isArray(obj))) {
			return {
				issueType: InputIssueType.Validity,
				message: `Input is not a dictionary`,
			};
		}
	}
	return null;
}

export { type InputIssue, InputIssueType, checkForInputIssues };
