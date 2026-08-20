export const InstructionMenu = () => {
	return (
		<>
			<div className="sidebar-subheading">Getting started</div>
			<div>
				In SUSI, you can create, export, and import configuration files for running energy system simulations
				with ReSiE. To add a component, open <b>Components</b> in the sidebar and drag one onto the canvas.
				Right-click a component to delete, duplicate, or edit it. You can also double-click it to open{' '}
				<b>Edit Component</b>, where you can change its parameters.
			</div>
			<div className="sidebar-subheading">Extended Documentation </div>
			<div>
				You can find an extended documentation of ReSiE{' '}
				<a href="https://quasi-software.readthedocs.io/en/latest/" target="_blank">
					here
				</a>
				. A detailed description of every component specific input parameter of ReSiE can be found in{' '}
				<a href="https://quasi-software.readthedocs.io/en/latest/resie_component_parameters/" target="_blank">
					this chapter.
				</a>
			</div>
			<div className="sidebar-subheading">Mediums </div>
			<div>
				Two components can be connected only if their media match. If one medium is undefined, SUSI sets it
				automatically to match the other. If both are undefined, an error is shown. Set a component’s media
				under <b>Edit Component</b>.
				<br />
				Available media and their colors can be changed under <b>Mediums</b> in the sidebar. To connect one
				component to several others using the same medium, add a Bus between them. A Bus is the only component
				that supports multiple connections for the same medium.
			</div>
			<div className="sidebar-subheading">Parameters </div>
			<div>
				SUSI currently cannot generate or export profile data. You can, however, enter paths to local profile
				files, which ReSiE will read. For instructions on creating profile files, see the{' '}
				<a
					href="https://quasi-software.readthedocs.io/en/latest/resie_input_file_format/#profile-file-format"
					target="_blank"
				>
					related section in the documentation.
				</a>
			</div>
			<div className="sidebar-subheading">Warnings </div>
			<div>
				A ⚠️ symbol beside a sidebar menu or on a component indicates invalid or missing input that must be
				fixed before exporting a valid configuration file.
				<br />
				If the export menu shows a warning but no sidebar menu does, a component has an issue. Right-click the
				canvas and select <b>Find Issue</b> to zoom to an affected component.
			</div>
			<div className="sidebar-subheading">Import/Export </div>
			<div>
				To import a file, paste its contents into the text field under <b>Import/Export</b> and select{' '}
				<b> Import.</b>
				<br />
				If the file does not include component positions, all components will appear in one place. Right-click
				the canvas and select <b>Reset Layout</b> to arrange them automatically.
				<br />
				To export, select <b>Export</b>. The generated configuration appears in the text field. Copy it into a{' '}
				<code>.json</code> file on your computer and use it as input for ReSiE. SUSI displays a warning if the
				project contains issues. You can export a configuration with errors to continue working on it later, but
				it will not run in ReSiE. Some issues, such as duplicate component names, may also prevent the file from
				being imported again.
			</div>
		</>
	);
};
