import { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import type { Medium } from '../../NodeDataStructures/Medium';
import importState from './Import/Import';
import exportState from './Export';
import type { SusiEdge } from '../../NodeDataStructures/SusiEdgeData';
import { AppContext } from '../../Reactflow-Components/AppContext';

export interface ImportExportMenuProps {
	setNodes: (nodes: NodeWithSusiData[]) => void;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	nodes: NodeWithSusiData[];
	edges: SusiEdge[];
}

const ImportExportMenu = (menuProps: ImportExportMenuProps) => {
	const [textContent, setTextContent] = useState('');
	const context = useContext(AppContext);
	if (!context) return <></>;
	const mediums = context.mediums;
	const setMediums = context.setMediums;

	const handleImport = () => {
		importState({ ...menuProps, stateJSON: textContent, setMediums: setMediums });
	};

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
