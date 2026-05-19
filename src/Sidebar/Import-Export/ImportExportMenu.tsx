import { useContext, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import importState from './Import/Import';
import exportState from './Export/Export';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { useReactFlow } from '@xyflow/react';
import { flushSync } from 'react-dom';
import { AppContext } from '../../AppContext';
import type { NodeInput } from '../../NodeDataStructures/Nodes/NodeInput';

export interface ImportExportMenuProps {
	setNodes: (nodes: SusiNode[]) => void;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	nodes: SusiNode[];
	edges: SusiEdge[];
	simulationParametersList: NodeInput[];
	ioSettingsList: NodeInput[];
}

const ImportExportMenu = (menuProps: ImportExportMenuProps) => {
	const [textContent, setTextContent] = useState('');
	const context = useContext(AppContext);
	if (!context) return <></>;
	const mediums = context.mediums;
	const setMediums = context.setMediums;
	const setLoadingMessage = context.setLoadingMessage;
	const { fitView } = useReactFlow();

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
			fitView();
		} catch (error) {
			setLoadingMessage(null);
			console.error('Import failed:', error);
		}
	}, [textContent, menuProps, setMediums, setLoadingMessage, fitView]);

	const handleExport = () => {
		const data = exportState({ ...menuProps, mediums: mediums });
		setTextContent(data);
	};

	return (
		<div className="import-export-menu">
			<div className="sidebar-heading">Import & Export</div>
			<div className="import-export-buttons">
				<Button variant="primary" onClick={handleImport}>
					Import
				</Button>
				<Button variant="primary" onClick={handleExport}>
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
