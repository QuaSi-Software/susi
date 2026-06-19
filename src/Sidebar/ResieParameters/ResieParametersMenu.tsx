import { type Dispatch, type SetStateAction } from 'react';
import type { ResieParameterMenuInfo } from './ResieParameterMenuInfo';
import InputMenuWithCategories from '../../Reactflow-Components/CustomInputWidgets/InputMenuWithCategories';

export interface ResieParametersMenuProps {
	selectedMenu?: string;
	resieParameterMenus: ResieParameterMenuInfo[];
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
}

export function ResieParametersMenu({
	selectedMenu,
	resieParameterMenus,
	setResieParameterMenus,
}: ResieParametersMenuProps) {
	function changeInputListElement(menuTitle: string, key: string, value: any, isIncludedChange: boolean) {
		setResieParameterMenus((resieParameterMenuInfo) => {
			const menu = resieParameterMenus.find((e) => e.title === menuTitle);
			const input = menu!.inputs.find((e) => e.resieName === key);
			if (!input)
				console.error(`Input with key ${key} should not be undefined in list ${resieParameterMenuInfo}`);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			menu!.inputs.forEach((e) => {
				e.checkInputValid(menu!.inputs);
			});
			return resieParameterMenuInfo;
		});
	}

	const menu = resieParameterMenus.find((e) => e.title === selectedMenu);
	return (
		<>
			<div className="sidebar-heading">{menu?.title}</div>
			<br />
			<InputMenuWithCategories
				title={menu!.title}
				inputs={menu!.inputs}
				inputCategories={menu!.categories}
				onValueChange={(key, value) => changeInputListElement(menu!.title, key, value, false)}
				onIncludedChange={(key, value) => changeInputListElement(menu!.title, key, value, true)}
				numberOfColumns={1}
				menuTypeName={menu!.title}
			/>
		</>
	);
}
