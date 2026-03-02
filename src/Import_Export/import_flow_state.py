# streamlit flow imports
import streamlit as st
from streamlit_flow import streamlit_flow as streamlit_flow_component
from streamlit_flow.elements import StreamlitFlowNode
from streamlit_flow.state import StreamlitFlowState

# project imports
from Components.node_types import get_node_type_with_name, NodeType
from Components.create_elements import create_new_node, create_new_edge
from Components.node_input import NodeInput, get_node_inputs

from Mediums.mediums import get_imported_medium
from Susi_Variables.susi_variable_list import simulation_parameters, io_settings

# Other imports
import json
from typing import Dict, List
import copy


def import_non_component_data(import_dict):
    """Update the Simulation Parameters and IO Settings in session state using the import data"""
    simulation_parameter_dict: Dict = import_dict[""]
    pass


def get_node_import_data(node_data):
    # import data
    node_import_data = node_data.get("import_data", None)
    if node_import_data == None:
        # this file was created before import support was added
        node_import_data = generate_node_import_data(node_data)
        node_data["import_data"] = node_import_data
    return node_import_data


def generate_node_import_data(obj: Dict[str, any]):
    """
    Generate data used in the import. This data is typically exported,
    but files created by hand or by previous versions of Susi may not contain it.
    """
    # Add Type name (Special case: Grid Input and Output)
    type_name = obj["type"]
    if type_name == "GridConnection":
        if obj["is_source"]:
            type_name = "gridinput"
        else:
            type_name = "gridoutput"

    return {
        "node_position": {"x": -0, "y": -0},
        "node_type": type_name,
    }


def get_output_refs(
    input_node_id: str, input_node_data: Dict, node_dict: Dict[str, StreamlitFlowNode]
):
    """
    * For a bus, return output_order.
    * For a list of output_refs, return that list.
    * For a dict output_refs:
        * create import_data["source_handles"] = { node_id : handle_index}.
        * Then return a list of the components.
    """
    # get outgoing edges of bus
    if input_node_data["import_data"]["node_type"].lower() == "bus":
        return input_node_data["connections"]["output_order"]
    # get output_refs of non-bus nodes if they are a list
    output_refs = input_node_data["output_refs"]
    if type(output_refs) == type([]):
        return input_node_data["output_refs"]

    # get all medium variable names for the source handles
    node: StreamlitFlowNode = node_dict[input_node_id]
    output_mediums = node.data["handle_medium_dict"]["source"]

    # if there's only 1 medium, the order of the edges doesn't matter
    # if there are multiple, we create a Dictionary { node_id : handle_index}
    if len(output_mediums) > 1:
        source_handles = {}
        for i, medium_var_name in enumerate(output_mediums):
            if medium_var_name in output_refs:
                input_node_id = output_refs[medium_var_name]
                source_handles[input_node_id] = i
        input_node_data["import_data"]["source_handles"] = source_handles

    # return a list of the output_refs node IDs only (without medium names)
    return [value for _, value in output_refs.items()]


def get_medium_list_from_components(components: List):
    """
    If the import file was not exported with a list of mediums,
    we have to go through the nodes, get all medium variables and
    add all medium names to a list. The colors and keys are generated.
    """
    mediums = []
    for _, node_data in components:
        # import data
        node_import_data = get_node_import_data(node_data)
        # find out which of these variables is a medium
        node_type: NodeType = get_node_type_with_name(node_import_data["node_type"])
        node_type_inputs = get_node_inputs(
            node_type.type_name
        )  # resie data for this node type
        mediums_in_current_node: List[NodeInput] = [
            x for x in node_type_inputs if x.is_medium
        ]

        node_input: NodeInput
        for node_input in mediums_in_current_node:
            medium_name = node_data.get(node_input.resie_name, None)
            if medium_name is not None and medium_name not in mediums:
                mediums.append(medium_name)
    return [[medium, None] for medium in mediums]


def set_mediums_from_import_list(imported_mediums: List[List[str]]):
    """Set the medium list in session state from the list of the imported mediums."""
    mediums = []
    for name, color in imported_mediums:
        mediums.append(get_imported_medium(name=name, color=color))
    st.session_state.mediums = mediums
    st.session_state.medium_list_input = copy.deepcopy(st.session_state.mediums)


def generate_state_from_import(import_data_text: str):
    """
    From the Resie input file as a JSON, generate a Streamlit Flow state
    or if there's an issue, generate a warning message.
    This function returns a list of warning messages and a StreamlitFlowState.

    """
    warning_messages = []
    try:
        import_dict: dict = json.loads(import_data_text)
    except ValueError as e:
        warning_messages.append("Input is not a valid JSON.")
        return warning_messages, None

    components = import_dict["components"].items()
    # get mediums
    mediums = import_dict.get("mediums", None)
    if mediums is None:
        mediums = get_medium_list_from_components(components)
    set_mediums_from_import_list(mediums)

    # First pass: create all the nodes
    node_array = []
    node_array.append(
        StreamlitFlowNode(id="dummy", pos=(0, 0), data={"content": ""}, hidden=True)
    )
    node_dict: Dict[str, StreamlitFlowNode] = {}
    for node_id, node_data in components:
        # import data
        node_import_data = get_node_import_data(node_data)

        node_type: NodeType = get_node_type_with_name(node_import_data["node_type"])
        pos = (
            node_import_data["node_position"]["x"],
            node_import_data["node_position"]["y"],
        )
        # create a node
        new_node = create_new_node(name=node_id, position=pos, node_type=node_type)

        # fill in with node info from import
        resie_data = new_node.data["resie_data"]
        node_input: NodeInput
        for node_input in resie_data:
            value = node_data.get(node_input.resie_name, None)
            if value is None:
                node_input.isIncluded = False
            else:
                node_input.set_value(value)

        node_array.append(new_node)
        node_dict[node_id] = new_node

    # Second Pass: create all the edges
    edge_array = []
    # key: node id, value: how many edges it has as input
    num_incoming_edges_per_node: Dict[str, int] = {}
    for input_node_id, input_node_data in components:
        output_refs = get_output_refs(input_node_id, input_node_data, node_dict)
        for input_node_edge_index, output_node_id in enumerate(output_refs):
            if output_node_id not in node_dict:
                warning_messages.append(
                    "Node " + output_node_id + " is not defined in components."
                )
                continue

            # get StreamlitFlowNode references
            input_node = node_dict[input_node_id]
            output_node = node_dict[output_node_id]
            # get number of edges already connected to output node and increment it
            output_node_incoming_edges = num_incoming_edges_per_node.get(
                output_node_id, 0
            )
            num_incoming_edges_per_node[output_node_id] = output_node_incoming_edges + 1

            # check if import data sets the source and target handles
            # It may only have the source handle, if the output_refs were a dictionary
            handles = [input_node_edge_index, output_node_incoming_edges]
            if "import_data" in input_node_data:
                import_data = input_node_data["import_data"]
                if "connection_handles" in import_data:
                    handles = import_data["connection_handles"][input_node_edge_index]
                if "source_handles" in import_data:
                    handles[0] = import_data["source_handles"][output_node_id]

            # create edge
            new_edge = create_new_edge(
                input_node, output_node, handles[0], handles[1], warning_messages
            )
            if new_edge is not None:
                edge_array.append(new_edge)

    new_state: StreamlitFlowState = StreamlitFlowState(node_array, edge_array)
    return warning_messages, new_state
