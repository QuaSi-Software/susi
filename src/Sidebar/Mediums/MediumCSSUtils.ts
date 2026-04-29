import type { Medium } from '../../NodeDataStructures/Mediums/Medium';

/**
 * Generate CSS variable rules for medium colors
 * Creates variables like: --medium-m_e_ac_230v, --medium-m_h_w_lt1, etc.
 * @param mediums Array of medium objects with key and color properties
 * @returns CSS rule string with all medium color variables
 */
const generateMediumCSSVariables = (mediums: Medium[]): string => {
	const variables = mediums.map((medium) => `--medium-${medium.key}: ${medium.color};`).join('\n\t');
	return `:root {\n\t${variables}\n}`;
};

export const setMediumCSSVariables = (mediums: Medium[]) => {
	let styleElement = document.getElementById('medium-colors-style');
	if (!styleElement) {
		styleElement = document.createElement('style');
		styleElement.id = 'medium-colors-style';
		document.head.appendChild(styleElement);
	}
	styleElement.textContent = generateMediumCSSVariables(mediums);
};
