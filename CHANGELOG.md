# SUSI changelog
Development of SUSI started with a prototype based on streamlit and a framework called streamlit-flow, based on React Flow. Eventually it was decided to forego streamlit and re-implement the existing functionality of the prototype directly in React Flow. This re-implementation did not follow versioning and therefore the first version of this repository starts with 1.0.0.

## v1.0.0
The first release of SUSI with a whole number of features:

#### **Canvas & Workflow Management**
- Interactive canvas for designing energy system configurations
- Drag-and-drop interface to add components to the canvas
- Pan and zoom navigation controls for canvas exploration
- Auto-layout feature to automatically arrange components on the canvas

#### **Component Management**
- Add components from a categorized sidebar menu
- Double-click or right-click components to edit their parameters
- Edit node parameters with type-specific widgets and validation
- Duplicate individual components with automatic renaming
- Delete individual components
- Delete all components at once

#### **Multi-Component Operations**
- Select multiple components on the canvas
- Delete, duplicate, or group multiple selected components simultaneously
- Create group nodes to organize and nest components hierarchically
- Automatic parent-child management when dragging nodes into groups

#### **Connections & Medium Flow**
- Connect components with edges (connections)
- Support for different edge types (styles) for visualization
- Delete individual connections via context menu
- Bus component for handling multiple connections of the same medium
- Medium validation to ensure compatible connections between components

#### **Medium Management**
- Create custom mediums (representing flows like electricity, heat, gas, etc.)
- Edit medium names and colors
- Delete mediums (with automatic cleanup of affected connections)
- View available mediums and their assigned colors

#### **Configuration & Import/Export**
- Export complete project configurations as JSON files
- Import previously saved configurations from JSON
- Preserve component positions and settings on export/import
- Auto-layout feature for imported configurations without position data

#### **Validation & Error Handling**
- Real-time validation of component inputs and configuration
- Visual warnings for invalid or missing parameters
- "Find Issue" feature to locate components with validation errors
- Error notifications displayed in overlay and context menus

#### **Undo & History**
- Undo previous actions with undo button
- Action history tracking throughout the session

#### **Customization & Settings**
- Light and dark theme switching
- Locale selection (US and German) for number and date formatting
- UAC prefix customization for component naming
- Edge type selection for visual preferences

#### **User Interface & Help**
- Built-in instructions and getting started guide
- Links to external ReSiE documentation
- Project information menu
- Responsive sidebar with multiple menu options (Components, Mediums, Parameters, Import/Export, Instructions, Settings, Project Info)