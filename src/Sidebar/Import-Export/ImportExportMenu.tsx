import { useState } from 'react';
import { Button } from 'react-bootstrap';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import type { Edge } from '@xyflow/react';
import type { Medium } from '../../NodeDataStructures/Medium';
import importState from './Import/Import';
import exportState from './Export';

export interface ImportExportMenuProps {
	setNodes: (nodes: NodeWithSusiData[]) => void;
	setEdges: (edges: Edge[]) => void;
	setMediums: (mediums: Medium[]) => void;
	logError: (errorMessage: string) => void;
	nodes: NodeWithSusiData[];
	edges: Edge[];
	mediums: Medium[];
}

const ImportExportMenu = (menuProps: ImportExportMenuProps) => {
	const [textContent, setTextContent] = useState('');
	const handleImport = () => {
		importState({ ...menuProps, stateJSON: textContent });
	};

	const handleExport = () => {
		const data = exportState(menuProps);
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
