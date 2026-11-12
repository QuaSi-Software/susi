import type { Dispatch, SetStateAction } from 'react';
import { DropdownMenu } from 'radix-ui';
import type { ResieParameterMenuInfo } from './ResieParameterMenuInfo';
import { MenuType } from '../Sidebar';

interface ResieParameterSubMenuProps {
	resieParameterMenu: string;
	setResieParameterMenu: Dispatch<SetStateAction<string>>;
	setSelectedMenu: Dispatch<SetStateAction<MenuType>>;
	resieParameterMenus: ResieParameterMenuInfo[];
}

export function ResieParameterSubMenu({
	setResieParameterMenu,
	setSelectedMenu,
	resieParameterMenus,
}: ResieParameterSubMenuProps) {
	function noInputIssues(resieParameterMenu: ResieParameterMenuInfo) {
		return resieParameterMenu.inputs.every((input) => input.isValid());
	}
	function onSelect(menu: ResieParameterMenuInfo) {
		setSelectedMenu(MenuType.ResieParameters);
		setResieParameterMenu(menu.title);
	}

	return (
		<>
			{resieParameterMenus.map((menu: ResieParameterMenuInfo) => (
				<DropdownMenu.Item className="DropdownMenuItem" onSelect={() => onSelect(menu)} key={menu.title}>
					{menu.title}
					{!noInputIssues(menu) && <> ⚠️</>}
				</DropdownMenu.Item>
			))}
		</>
	);
}
