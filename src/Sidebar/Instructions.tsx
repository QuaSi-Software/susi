export const InstructionMenu = () => {
	return (
		<>
			{/* <div className="sidebar-heading">How to use Susi</div> */}
			<div className="sidebar-subheading">Getting started</div>
			<div>
				To add new components, go to the Components menu in the sidebar and drag and drop the components onto
				the canvas. You can then right click the component to delete it again, to duplicate it or to edit it. In
				the Edit Component Menu, you can change any values associated with this Component.
			</div>
			<div className="sidebar-subheading">Mediums </div>
			<div>
				Two components can only be connected if they have the same medium. If one medium is undefined, it will
				be set to match automatically, but if the mediums are both not set or are undefined, you will get an
				error message. You can set mediums in the Edit Component Menu.
				<br />
				The available mediums and their colors can be edited in the Mediums menu in the Sidebar.
			</div>
			<div className="sidebar-subheading">Warnings </div>
			<div>
				You may see a warning sign: ⚠️ in the Sidebar next to a menu or on the corner of a component. This means
				that there is some invalid input that must be fixed to export a valid configuration file.
				<br />
				If you are getting a warning message in the export menu, but none of the the sidebar menus have warning
				signs, then there is a component with an issue in your project. If you cannot find it, you can
				right-click the canvas and click 'Find Issue' to zoom in on a component with problems.
			</div>
			<div className="sidebar-subheading">Import/Export </div>
			<div>
				To import a file, paste the text into the text field in the Import/Export Menu and click import.
				<br />
				If the import file did not contain info on where each component should be in Susi, they will all be
				clustered at the same position. Right click the canvas and click Reset Layout to automatically generate
				a layout for the components.
				<br />
				To export, click export and the export file will show up in the text field. You will get a warning
				message if there are issues in your project.
				<br />
				Some issues like duplicate component names may cause the configuration file to not be imported properly
				again. Please avoid exporting a faulty file.
			</div>
		</>
	);
};
