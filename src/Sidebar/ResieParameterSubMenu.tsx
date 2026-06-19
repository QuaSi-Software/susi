import type { Dispatch, SetStateAction } from 'react';
import type { MenuInputs } from '../FetchingApiData/MenuInputs';
import { DropdownMenu } from 'radix-ui';
import { MenuType } from './Sidebar';

interface ResieParameterSubMenuProps {
	resieParameterMenu: string;
	setResieParameterMenu: Dispatch<SetStateAction<string>>;
	setSelectedMenu: Dispatch<SetStateAction<MenuType>>;
	resieParameterMenus: MenuInputs[];
}

export function ResieParameterSubMenu({
	resieParameterMenu,
	setResieParameterMenu,
	setSelectedMenu,
	resieParameterMenus,
}: ResieParameterSubMenuProps) {
	function noInputIssues(resieParameterMenu: MenuInputs) {
		return resieParameterMenu.inputs.every((input) => input.isValid());
	}
	function anyMenuHasWarning() {
		const allMenusFine = resieParameterMenus.every((menu) => noInputIssues(menu));
		return !allMenusFine;
	}
	function onSelect(menu: MenuInputs) {
		setSelectedMenu(MenuType.ResieParameters);
		setResieParameterMenu(menu.title);
	}

	return (
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
				{MenuType.ResieParameters as string}
				{anyMenuHasWarning() && <> ⚠️</>}
			</DropdownMenu.SubTrigger>
			<DropdownMenu.Portal>
				<DropdownMenu.SubContent className="DropdownMenuSubContent" sideOffset={2} alignOffset={-5}>
					{resieParameterMenus.map((menu: MenuInputs) => (
						<DropdownMenu.Item
							className="DropdownMenuItem"
							onSelect={() => onSelect(menu)}
							key={menu.title}
						>
							{menu.title}
							{!noInputIssues(menu) && <> ⚠️</>}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.SubContent>
			</DropdownMenu.Portal>
		</DropdownMenu.Sub>
	);
}
