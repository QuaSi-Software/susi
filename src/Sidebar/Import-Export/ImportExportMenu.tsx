import { useContext, useState, useCallback, type Dispatch, type SetStateAction, useEffect } from 'react';
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
import { resizeGroupNodeToFitChildren } from '../../NodeDataStructures/GroupNodes/ResizeGroupNodeToFitChildren';

export interface ImportExportMenuProps {
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	nodes: SusiNode[];
	edges: SusiEdge[];
	resieParameterMenus: ResieParameterMenuInfo[];
	setresieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
	nodeTypes: Record<string, NodeType> | null;
}

const ImportExportMenu = (menuProps: ImportExportMenuProps) => {
	const [textContent, setTextContent] = useState('');
	const [resizeGroupNodes, setResizeGroupNodes] = useState<boolean>(false);
	const context = useContext(AppContext);
	if (!context || menuProps.nodeTypes === null) return <></>;
	const mediums = context.mediums;
	const setCheckState = context.setCheckState;
	const setMediums = context.setMediums;
	const setLoadingMessage = context.setLoadingMessage;
	const { fitView } = useReactFlow();

	useEffect(() => {
		if (!resizeGroupNodes) return;
		const haveMeasurements = menuProps.nodes.every((n) => n.type === 'group' || n.measured !== undefined);
		if (!haveMeasurements) return;
		/** resize group nodes to match their children. At this point, the children are in global coordinates */
		menuProps.setNodes((nodes: SusiNode[]) => {
			const groupNodes = nodes.filter((n) => n.type === 'group');
			let updatedNodes = nodes;
			groupNodes.forEach((groupNode) => {
				updatedNodes = resizeGroupNodeToFitChildren(updatedNodes, groupNode);
			});
			return updatedNodes;
		});
		setResizeGroupNodes(false);
	}, [menuProps.nodes, menuProps.setNodes]);

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
						nodeTypes: menuProps.nodeTypes!,
					});
					resolve();
				}, 0);
			});
			setLoadingMessage(null);
			setCheckState(true);
			fitView();
			setTextContent('');
			setResizeGroupNodes(true);
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

		return true;
	};

	const exportWarning = !menusAndComponentsValid();
	return (
		<div className="import-export-menu">
			<div
				className="input-warning-message warning-text"
				style={{ visibility: exportWarning ? 'visible' : 'hidden' }}
			>
				There are issues in your project that will cause your export file to be invalid.
				<br />
				Please check the Sidebar Menus and the Components for warning signs. ⚠️
			</div>
			{/* )} */}
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
