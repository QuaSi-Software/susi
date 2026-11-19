import { useContext, useState, useCallback, type Dispatch, type SetStateAction, useRef } from 'react';
import { Button } from 'react-bootstrap';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import importState from './Import/Import';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { useReactFlow } from '@xyflow/react';
import { flushSync } from 'react-dom';
import { AppContext } from '../../AppContext';
import type { ComponentType } from '../../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ResieParameterMenuInfo } from '../ResieParameters/ResieParameterMenuInfo';
import type { ControlModule } from '../../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';

export interface ImportButtonProps {
	controlParameters: ResieParameterMenuInfo | null;
	controlModules: ControlModule[];
	resieParameterMenus: ResieParameterMenuInfo[];
	nodeTypes: Record<string, ComponentType> | null;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
}

const ImportButton = (menuProps: ImportButtonProps) => {
	const [textContent, setTextContent] = useState('');
	const context = useContext(AppContext);
	const { fitView } = useReactFlow();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const setCheckState = context?.setCheckState;
	const setMediums = context?.setMediums;
	const setLoadingMessage = context?.setLoadingMessage;

	// --- Import ------------------------------------------------------------
	/** In order to use a bootstrap button for consistent style, this button manually clicks an invisible input widget */
	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	/** Called by input widget: reads a file and if it is a valid file, sends its content to handleImport */
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			try {
				const text = String(reader.result ?? '');
				handleImport(text);
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

	/**
	 * takes the JSON to import as a string and uses the setters of the state variables in App.tsx
	 * to create a new state for the app (nodes, edges, mediums, general parameters)
	 */
	const handleImport = useCallback(
		async (stateJSON: string) => {
			if (menuProps.controlParameters === null || !context || !menuProps.nodeTypes) return;
			try {
				flushSync(() => setLoadingMessage!('Importing file...'));
				// Wait for the import to complete before clearing the loading message
				await new Promise<void>((resolve, reject) => {
					setTimeout(() => {
						try {
							importState({
								...menuProps,
								stateJSON,
								setMediums: setMediums!,
								nodeTypes: menuProps.nodeTypes!,
								controlParameters: menuProps.controlParameters!,
							});
							resolve();
						} catch (error) {
							reject(error);
						}
					}, 0);
				});
				setLoadingMessage!(null);
				setCheckState!(true);
				fitView();
				setTextContent('');
			} catch (error) {
				setLoadingMessage!(null);
				console.error(`Import failed: ${error}`);
				menuProps.logError(
					`File could not be imported. Please file a bug report with the import file attached.`
				);
			}
		},
		[textContent, menuProps, setMediums, setLoadingMessage, fitView]
	);

	return (
		<>
			<Button variant="primary" onClick={handleImportClick}>
				<i className="bi bi-download"> </i>
				Import
			</Button>
			<input
				ref={fileInputRef}
				type="file"
				accept="application/json,.json"
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default ImportButton;
