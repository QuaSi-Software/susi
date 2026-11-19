import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import exportState from './Export/Export';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import type { ComponentType } from '../../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ResieParameterMenuInfo } from '../ResieParameters/ResieParameterMenuInfo';
import { findUnconnectedNodes } from '../../NodeDataStructures/Nodes/FindUnconnectedNodes';
import { AppContext } from '../../AppContext';

export interface ImportExportMenuProps {
	nodes: SusiNode[];
	edges: SusiEdge[];
	resieParameterMenus: ResieParameterMenuInfo[];
	nodeTypes: Record<string, ComponentType> | null;
	exportFileName: string;
	logError: (errorMessage: string) => void;
}

const ExportButton = (menuProps: ImportExportMenuProps) => {
	const context = useContext(AppContext);
	if (!context || menuProps.nodeTypes === null) return <></>;
	const mediums = context.mediums;

	const handleExport = () => {
		const data = exportState({ ...menuProps, mediums: mediums });
		downloadFile(data);
	};

	/** Checks if all general parameter menus, mediums and components are valid (have only valid inputs) */
	const menusAndComponentsValid = (): boolean => {
		const mediumsValid = mediums.every((m) => m.valid);
		if (!mediumsValid) return false;
		const nodeInputsValid = menuProps.nodes.every((n) => n.data.hasValidInputs);
		if (!nodeInputsValid) return false;
		const generalParamsValid = menuProps.resieParameterMenus.every((menu) => {
			return menu.inputs.every((input) => input.isValid());
		});
		if (!generalParamsValid) return false;
		const allNodeNamesUnique = menuProps.nodes.every((node, nodeIndex) => {
			const duplicate = menuProps.nodes.find((e, i) => e.data.content === node.data.content && i !== nodeIndex);
			return duplicate === undefined;
		});
		if (!allNodeNamesUnique) return false;

		return true;
	};

	/** Generates a JSON file with the content as the data string and downloads it to the user's machine */
	const downloadFile = (data: string) => {
		const blob = new Blob([data], { type: 'application/json' });
		const a = document.createElement('a');
		a.download = `${menuProps.exportFileName}.json`;
		a.href = window.URL.createObjectURL(blob);
		const clickEvt = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
		});
		a.dispatchEvent(clickEvt);
		a.remove();
	};

	/** Create a warning message for when the user hovers over the export button. */
	function getWarningMessage(): string {
		const exportWarning = !menusAndComponentsValid();
		const unconnectedNodes = findUnconnectedNodes(menuProps.nodes, menuProps.edges);
		let message = '';
		if (unconnectedNodes.length !== 0) {
			message += 'The following nodes are not connected to anything:';
			message += `\n${unconnectedNodes.map((node) => `• ${node.data.content}`).join('\n')}`;
			message += '\n\n';
		}
		if (exportWarning) {
			message += `There are issues in your project that may cause your export file to be invalid. \nPlease check the Sidebar Menus and the Components for warning signs. ⚠️`;
			message += '\n';
		}
		return message;
	}

	const warningMessage = getWarningMessage();
	return (
		<Button variant="primary" onClick={handleExport} title={warningMessage}>
			{warningMessage !== '' && <> ⚠️ </>}
			<i className="bi bi-upload"> </i>
			Export
		</Button>
	);
};

export default ExportButton;
