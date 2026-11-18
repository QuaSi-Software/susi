import { useRef, useState } from 'react';

/**
 * Two Bootstrap-styled buttons:
 *  1. "Import JSON"  – lets the user pick a local .json file and parses it into
 *                      a JavaScript object (dictionary), kept in component state.
 *  2. "Export JSON"  – serializes that dictionary back to a .json file and
 *                      triggers a download in the user's browser.
 */
function ImportExportButtons() {
	const [data, setData] = useState<Record<string, unknown> | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// --- Import ------------------------------------------------------------
	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const text = String(e.target?.result ?? '');
				const parsed = JSON.parse(text) as Record<string, unknown>;
				setData(parsed);
				console.log('Imported JSON:', parsed);
			} catch (err) {
				console.error('Failed to parse JSON file:', err);
				alert('Could not parse the selected file as JSON.');
			}
		};
		reader.onerror = () => {
			console.error('Error reading file:', reader.error);
			alert('Could not read the selected file.');
		};
		reader.readAsText(file);

		// Reset so selecting the same file again still triggers onChange
		event.target.value = '';
	};

	// --- Export ------------------------------------------------------------
	const handleExportClick = () => {
		if (!data) {
			alert('No data to export. Please import a JSON file first.');
			return;
		}

		const json = JSON.stringify(data, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'export.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// --- Render ------------------------------------------------------------
	return (
		<div className="d-flex gap-2">
			<button type="button" className="btn btn-primary" onClick={handleImportClick}>
				Import JSON
			</button>

			<button
				type="button"
				className="btn btn-secondary"
				onClick={handleExportClick}
				disabled={data === undefined}
			>
				Export JSON
			</button>

			<input
				ref={fileInputRef}
				type="file"
				accept="application/json,.json"
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
		</div>
	);
}

export default ImportExportButtons;
