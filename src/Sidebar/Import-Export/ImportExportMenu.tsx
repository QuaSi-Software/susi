import { useContext, useState, useCallback, type Dispatch, type SetStateAction } from 'react';
import { Button } from 'react-bootstrap';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import importState from './Import/Import';
import exportState from './Export/Export';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { useReactFlow } from '@xyflow/react';
import { flushSync } from 'react-dom';
import { AppContext } from '../../AppContext';
import type { NodeType } from '../../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ResieParameterMenuInfo } from '../ResieParameters/ResieParameterMenuInfo';
import { WarningMessage } from '../../Reactflow-Components/CustomInputWidgets/WarningMessage';
import { findUnconnectedNodes } from '../../NodeDataStructures/Nodes/FindUnconnectedNodes';

export interface ImportExportMenuProps {
	nodes: SusiNode[];
	edges: SusiEdge[];
	controlParameters: ResieParameterMenuInfo | null;
	resieParameterMenus: ResieParameterMenuInfo[];
	nodeTypes: Record<string, NodeType> | null;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
}

const ImportExportMenu = (menuProps: ImportExportMenuProps) => {
	const [textContent, setTextContent] = useState('');
	const context = useContext(AppContext);
	if (!context || menuProps.nodeTypes === null) return <></>;
	const mediums = context.mediums;
	const setCheckState = context.setCheckState;
	const setMediums = context.setMediums;
	const setLoadingMessage = context.setLoadingMessage;
	const { fitView } = useReactFlow();

	const handleImport = useCallback(async () => {
		if (menuProps.controlParameters === null) return;
		try {
			flushSync(() => setLoadingMessage('Importing file...'));
			// Wait for the import to complete before clearing the loading message
			await new Promise<void>((resolve) => {
				setTimeout(() => {
					importState({
						...menuProps,
						stateJSON: textContent,
						setMediums: setMediums,
						nodeTypes: menuProps.nodeTypes!,
						controlParameters: menuProps.controlParameters!,
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

	const menusAndComponentsValid = (): boolean => {
		const mediumsValid = mediums.every((m) => m.valid);
		if (!mediumsValid) return false;
		const nodeInputsValid = menuProps.nodes.every((n) => n.data.hasValidInputs);
		if (!nodeInputsValid) return false;
		const simulationParamsValid = menuProps.resieParameterMenus.every((menu) => {
			return menu.inputs.every((input) => input.isValid());
		});
		if (!simulationParamsValid) return false;
		const allNodeNamesUnique = menuProps.nodes.every((node, nodeIndex) => {
			const duplicate = menuProps.nodes.find((e, i) => e.data.content === node.data.content && i !== nodeIndex);
			return duplicate === undefined;
		});
		if (!allNodeNamesUnique) return false;

		return true;
	};

	const exportWarning = !menusAndComponentsValid();
	const unconnectedNodes = findUnconnectedNodes(menuProps.nodes, menuProps.edges);
	return (
		<div className="import-export-menu">
			<WarningMessage
				redWarning={false}
				message={unconnectedNodes.length === 0 ? '' : 'Project has unconnected nodes'}
				hoverMessage={`The following nodes are not connected to anything:\n${unconnectedNodes.map((node) => `• ${node.data.content}`).join('')}`}
			/>
			<WarningMessage
				redWarning={true}
				message={exportWarning ? 'Warning: issues in project' : ''}
				hoverMessage={`There are issues in your project that may cause your export file to be invalid. \nPlease check the Sidebar Menus and the Components for warning signs. ⚠️`}
			/>
			<div className="import-export-buttons">
				<Button variant="primary" onClick={handleImport} disabled={textContent === ''}>
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
