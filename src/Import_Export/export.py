"""Functionality for exporting the flow as energy system input file for ReSiE."""

import streamlit as st
from streamlit_flow.elements import StreamlitFlowNode

from Components.node_input import NodeInput
from Mediums.mediums import MediumInput, get_medium_list_for_export
from Susi_Variables.susi_variable_export_import import export_susi_variables

from json import dumps
from typing import Dict, List


def base_dict():
    """Dictionary with basic settings/parameters for the input file.

    # Returns:
    -`dict`: The base dictionary
    """
    export_dict = export_susi_variables()
    export_dict["components"] = {}
    return export_dict


def get_outputs(node, nodes, edges):
    """Outputs of the given node as list of UACs.

    # Args:
    -`node:StreamlitFlowNode`: The node
    -`nodes:dict<int,StreamlitFlowNode>`: All nodes in a dict by their ID
    -`edges:list<StreamlitFlowEdge>`: All edges in a list
    # Returns:
    -`list<tuple<int, int>>`: A list of tuples with the index of the source and target handle of each connection
    -`list<str>`: A list of UACs that are the outputs of the given node
    """
    outgoing = {}
    handles = []
    for edge in edges:
        if edge.source == node.id:
            # set handles
            source_handle_index = int(edge.sourceHandle[-1])
            handleTuple = (source_handle_index, int(edge.targetHandle[-1]))
            handles.append(handleTuple)
            # find medium associated with source handle
            source_mediums = node.data["handle_medium_dict"]["source"]
            medium_var_name = source_mediums[source_handle_index]
            # save connection
            target = nodes[edge.target]
            outgoing[medium_var_name] = target.data["content"]
    return handles, outgoing


def energy_matrix(nr_rows, nr_columns):
    """Construct the energy matrix config with the given number of rows and columns.

    # Args:
    -`nr_rows`: Number of rows
    -`nr_columns`: Number of columns
    # Returns:
    -`list<list>`: The energy matrix
    """
    rows = []
    for _ in range(nr_rows):
        row = []
        for __ in range(nr_columns):
            row.append(1)
        rows.append(row)
    return rows


def get_bus_connections(node, nodes, edges):
    """
    Create the connections dictionary  for a bus with:
    * input_order
    * output_order
    * energy_flow

    This function exists for busses only, because all other nodes export their connections as dictionaries

    # Args:
    -`node:StreamlitFlowNode`: The node
    -`nodes:dict<int,StreamlitFlowNode>`: All nodes in a dict by their ID
    -`edges:list<StreamlitFlowEdge>`: All edges in a list
    # Returns:
    -`list<str>`: A list of UACs that are the inputs of the given node
    """
    incoming_connections = []
    outgoing_connections = []
    for edge in edges:
        if edge.target == node.id:
            source = nodes[edge.source]
            incoming_connections.append(source.data["content"])
        if edge.source == node.id:
            target = nodes[edge.target]
            outgoing_connections.append(target.data["content"])

    return {
        "input_order": incoming_connections,
        "output_order": outgoing_connections,
        "energy_flow": energy_matrix(
            len(incoming_connections),
            len(outgoing_connections),
        ),
    }


def export_flow(flow):
    """Export the given flow as ReSiE input file.

    # Args
    -`flow:StreamlitFlow`: The flow to export
    # Returns
    -`str`: The content of the input file
    """
    as_dict = base_dict()
    nodes: Dict[str, StreamlitFlowNode] = {node.id: node for node in flow.nodes}
    edges = flow.edges
    mediums: List[MediumInput] = st.session_state.mediums
    as_dict["mediums"] = get_medium_list_for_export()

    node: StreamlitFlowNode
    for node in flow.nodes:
        if node.id == "dummy":
            continue

        comp_dict = {}
        node_input: NodeInput
        for node_input in node.data["resie_data"]:
            if not node_input.isIncluded and not node_input.required:
                continue
            # for mediums, the value that is stored is the key not the name of the medium
            # for the export, we want the name though
            if node_input.is_medium:
                medium = next(
                    (m for m in mediums if m.key == node_input.value),
                    MediumInput(name="Not Set"),
                )
                comp_dict[node_input.resie_name] = medium.name
                continue
            comp_dict[node_input.resie_name] = node_input.value
        # for importing only
        comp_dict["import_data"] = {
            "node_position": node.position,
            "node_type": node.data["component_type"],
        }

        # set output_refs/connections
        if node.data["component_type"].lower() == "bus":
            comp_dict["connections"] = get_bus_connections(node, nodes, edges)
        else:
            handles, outputs = get_outputs(node, nodes, edges)
            comp_dict["output_refs"] = outputs
            comp_dict["import_data"]["connection_handles"] = handles

        as_dict["components"][node.data["content"]] = comp_dict

    return dumps(as_dict, indent=4)
