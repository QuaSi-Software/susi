import { useEffect } from 'react';

export function useCloseModalOnEnter(show: boolean, closeModal: () => void) {
	useEffect(() => {
		if (!show) return;

		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'Enter') closeModal();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [show, closeModal]);
}
