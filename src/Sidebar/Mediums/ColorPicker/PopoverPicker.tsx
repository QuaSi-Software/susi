import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import useClickOutside from './useClickOutside';

interface PopoverPickerInput {
	color: string;
	onChange: (color: string) => void;
}

export const PopoverPicker: React.FC<PopoverPickerInput> = ({ color, onChange }) => {
	const popover = useRef<HTMLDivElement>(null);
	const [isOpen, toggle] = useState(false);
	const [currentColor, setCurrentColor] = useState<string>(color);

	const close = useCallback(() => toggle(false), []);
	useClickOutside(popover, close);

	useEffect(() => {
		const timeoutId = setTimeout(() => onChange(currentColor), 300);
		return () => clearTimeout(timeoutId);
	}, [currentColor]);
	useEffect(() => {
		if (currentColor !== color) setCurrentColor(color);
	}, [color]);

	return (
		<div className="picker">
			<div className="swatch" style={{ backgroundColor: currentColor }} onClick={() => toggle(true)} />

			{isOpen && (
				<div className="popover" ref={popover}>
					<HexColorPicker color={currentColor} onChange={setCurrentColor} />
				</div>
			)}
		</div>
	);
};
