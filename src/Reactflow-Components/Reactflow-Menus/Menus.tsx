interface MenuPosition {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

const createMenuPosition = (event: React.MouseEvent, ref: React.RefObject<HTMLInputElement | null>) => {
	const pane = ref.current?.getBoundingClientRect();
	console.assert(pane != undefined);
	if (pane == undefined) {
		//** Return zero MenuPosition */
		return {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		};
	}
	return {
		top: event.clientY,
		left: event.clientX,
		right: pane.width - event.clientX,
		bottom: pane.height - event.clientY,
	};
};

export { type MenuPosition, createMenuPosition };
