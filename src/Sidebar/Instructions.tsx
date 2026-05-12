export const InstructionMenu = () => {
	return (
		<>
			<div className="sidebar-heading">How to use Susi</div>
			<div className="sidebar-subheading">Getting started</div>
			<div>
				To add new components, go to the Components menu in the sidebar and drag and drop the components onto
				the canvas. You can then right click the node to delete it again, to duplicate it or to edit it. In the
				Edit Node Menu, you can change any values associated with this Component.
			</div>
			<div className="sidebar-subheading">Mediums </div>
			<div>
				To connect two components, you have to make sure that the connection has the same medium on both ends.
				Mediums are defined and can be edited in the Mediums menu. You can edit the components' medium for each
				of its connections inside the Edit Component Menu.
			</div>
			<div className="sidebar-subheading">Import/Exort </div>
			<div>
				To import a file, paste the text into the text field in the Import/Export Menu and click import.
				<br />
				If the import file did not contain info on where each component should be in Susi, they will all be
				clustered at the same position. Right click the canvas and click Reset Layout to automatically generate
				a layout for the components.
				<br />
				To export, click export and the export file will show up in the text field.
			</div>
		</>
	);
};
