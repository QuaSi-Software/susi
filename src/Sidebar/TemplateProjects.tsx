import { useState, useEffect, useContext, useCallback } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useReactFlow } from '@xyflow/react';
import { flushSync } from 'react-dom';
import { AppContext } from '../AppContext';
import importState from './Import-Export/Import/Import';
import type { SusiNode } from '../NodeDataStructures/Nodes/SusiNode';
import type { SusiEdge } from '../NodeDataStructures/Edges/SusiEdge';
import type { Dispatch, SetStateAction } from 'react';
import type { NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ResieParameterMenuInfo } from './ResieParameters/ResieParameterMenuInfo';
import type { ControlModule } from '../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';
import { getTitleFromKey } from '../Reactflow-Components/ContextMenus/ContextMenuUtils';

const GITHUB_API_URL = 'https://api.github.com/repos/QuaSi-Software/ResieQuasi.jl/contents/examples';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/QuaSi-Software/ResieQuasi.jl/master/examples';

interface GitHubFile {
	name: string;
	path: string;
	type: 'file' | 'dir';
	download_url: string | null;
}

export interface TemplateProjectsProps {
	nodes: SusiNode[];
	edges: SusiEdge[];
	controlParameters: ResieParameterMenuInfo | null;
	controlModules: ControlModule[];
	resieParameterMenus: ResieParameterMenuInfo[];
	nodeTypes: Record<string, NodeType> | null;
	setNodes: Dispatch<SetStateAction<SusiNode[]>>;
	setEdges: (edges: SusiEdge[]) => void;
	logError: (errorMessage: string) => void;
	setResieParameterMenus: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>;
}

export const TemplateProjects = (props: TemplateProjectsProps) => {
	const [templates, setTemplates] = useState<GitHubFile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const context = useContext(AppContext);
	const { fitView } = useReactFlow();

	useEffect(() => {
		fetchTemplateList();
	}, []);

	const fetchTemplateList = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(GITHUB_API_URL);
			if (!response.ok) {
				throw new Error(`Failed to fetch template list: ${response.status}`);
			}
			const files: GitHubFile[] = await response.json();
			// Filter to only show JSON files
			const jsonFiles = files.filter((file) => file.type === 'file' && file.name.endsWith('.json'));
			setTemplates(jsonFiles);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load templates');
		} finally {
			setLoading(false);
		}
	};

	const handleLoadTemplate = useCallback(
		async (template: GitHubFile) => {
			if (!context || props.nodeTypes === null || props.controlParameters === null) {
				return;
			}

			try {
				flushSync(() => context.setLoadingMessage(`Loading template: ${formatTemplateName(template.name)}...`));
				// Fetch the raw JSON content
				const rawUrl = `${GITHUB_RAW_BASE}/${template.name}`;
				const response = await fetch(rawUrl);
				if (!response.ok) {
					throw new Error(`Failed to fetch template: ${response.status}`);
				}
				const jsonContent = await response.text();

				await new Promise<void>((resolve) => {
					setTimeout(() => {
						importState({
							stateJSON: jsonContent,
							setNodes: props.setNodes,
							setEdges: props.setEdges,
							setMediums: context.setMediums,
							logError: props.logError,
							resieParameterMenus: props.resieParameterMenus,
							setResieParameterMenus: props.setResieParameterMenus,
							nodeTypes: props.nodeTypes!,
							controlParameters: props.controlParameters!,
							controlModules: props.controlModules,
						});
						resolve();
					}, 0);
				});

				context.setLoadingMessage(null);
				context.setCheckState(true);
				fitView();
			} catch (err) {
				context.setLoadingMessage(null);
				const errorMessage = err instanceof Error ? err.message : 'Failed to load template';
				props.logError(errorMessage);
			} finally {
			}
		},
		[context, props, fitView]
	);

	const formatTemplateName = (filename: string): string => {
		// Remove .json extension and format nicely
		return getTitleFromKey(filename.replace('.json', ''));
	};

	if (!context || props.nodeTypes === null) {
		return null;
	}

	return (
		<>
			<div className="sidebar-subheading">Template Projects</div>
			<div>
				Load example projects from the{' '}
				<a
					href="https://github.com/QuaSi-Software/ResieQuasi.jl/tree/master/examples"
					target="_blank"
					rel="noopener noreferrer"
				>
					ReSiE examples repository
				</a>
				. These templates demonstrate various energy system configurations.
			</div>

			{loading && (
				<div className="template-loading">
					<Spinner animation="border" size="sm" /> Loading templates...
				</div>
			)}

			{error && (
				<div className="template-error">
					<span>⚠️ {error}</span>
					<Button variant="link" size="sm" onClick={fetchTemplateList}>
						Retry
					</Button>
				</div>
			)}

			{!loading && !error && templates.length === 0 && (
				<div className="template-empty">No template projects found.</div>
			)}

			{!loading && !error && templates.length > 0 && (
				<div className="template-list">
					{templates.map((template) => (
						<Button
							key={template.name}
							variant="outline-primary"
							size="sm"
							className="template-button"
							onClick={() => handleLoadTemplate(template)}
						>
							{formatTemplateName(template.name)}
						</Button>
					))}
				</div>
			)}
		</>
	);
};
