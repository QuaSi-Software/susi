import { useContext, useState, useCallback, type Dispatch, type SetStateAction } from 'react';
import { Button } from 'react-bootstrap';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import importState from './Import/Import';
import exportState from './Export/Export';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { useReactFlow } from '@xyflow/react';
import { flushSync } from 'react-dom';
import { AppContext } from '../../AppContext';
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';

export interface ImportExportMenuProps {
	setNodes: (nodes: SusiNode[]) => void;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	nodes: SusiNode[];
	edges: SusiEdge[];
	simulationParametersList: InputObject[];
	ioSettingsList: InputObject[];
	setIOSettings: Dispatch<SetStateAction<InputObject[]>>;
	setSimulationParameters: Dispatch<SetStateAction<InputObject[]>>;
}

const ImportExportMenu = (menuProps: ImportExportMenuProps) => {
	const [textContent, setTextContent] = useState('');
	const context = useContext(AppContext);
	if (!context) return <></>;
	const mediums = context.mediums;
	const setCheckState = context.setCheckState;
	const setMediums = context.setMediums;
	const setLoadingMessage = context.setLoadingMessage;
	const { fitView } = useReactFlow();
	/** Check if all nodes and the medium menu have valid inputs */

	const handleImport = useCallback(async () => {
		try {
			flushSync(() => setLoadingMessage('Importing file...'));
			// Wait for the import to complete before clearing the loading message
			await new Promise<void>((resolve) => {
				setTimeout(() => {
					importState({
						...menuProps,
						stateJSON: textContent,
						setMediums: setMediums,
						getNodeInputs: context.getNodeInputs,
					});
					resolve();
				}, 0);
			});
			setLoadingMessage(null);
			setCheckState(true);
			fitView();
			setTextContent('');
		} catch (error) {
			setLoadingMessage(null);
			console.error('Import failed:', error);
		}
	}, [textContent, menuProps, setMediums, setLoadingMessage, fitView]);

	const handleExport = () => {
		const data = exportState({ ...menuProps, mediums: mediums });
		setTextContent(data);
	};

	const canExport = (): boolean => {
		const mediumsValid = mediums.every((m) => m.valid);
		if (!mediumsValid) return false;
		const nodeInputsValid = menuProps.nodes.every((n) => n.data.hasValidInputs);
		if (!nodeInputsValid) return false;
		const simulationParamsValid = menuProps.simulationParametersList.every((input) => input.isValid);
		if (!simulationParamsValid) return false;
		const ioSettingsValid = menuProps.ioSettingsList.every((input) => input.isValid);
		if (!ioSettingsValid) return false;

		return true;
	};

	const exportDisabled = !canExport();
	return (
		<div className="import-export-menu">
			<div className="sidebar-heading">Import & Export</div>
			<div className="import-export-buttons">
				<Button variant="primary" onClick={handleImport} disabled={textContent === ''}>
					Import
				</Button>
				<Button variant="primary" onClick={handleExport} disabled={exportDisabled}>
					Export
				</Button>
			</div>
			<textarea
				className="import-export-textarea"
				value={textContent}
				onChange={(e) => setTextContent(e.target.value)}
				placeholder="Paste import file here to import"
			/>
		</div>
	);
};

export default ImportExportMenu;
