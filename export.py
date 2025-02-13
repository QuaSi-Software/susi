"""Functionality for exporting the flow as energy system input file for ReSiE.
"""
from json import dumps
from components import component_config

def base_dict():
    """Dictionary with basic settings/parameters for the input file.

    # Returns:
    -`dict`: The base dictionary
    """
    return {
        "io_settings": {
            "csv_output_file": "./output/out.csv",
            "auxiliary_info": True,
            "auxiliary_info_file": "./output/auxiliary_info.md",
            "sankey_plot": "default",
            "csv_time_unit": "date",
            "csv_output_keys": "All",
            "output_plot": "All",
        },
        "simulation_parameters": {
            "start": "01.01.2024 00:00",
            "end": "07.01.2024 23:00",
            "start_end_unit": "dd.mm.yyyy HH:MM",
            "time_step": 900,
            "time_step_unit": "seconds"
        },
        "components": {}
    }

def get_outputs(node, flow):
    """Outputs of the given node as list of node IDs (=UAC).

    # Args:
    -`node:StreamlitFlowNode`: The node
    -`flow:StreamlitFlow`: The flow (contains edges)
    # Returns:
    -`list<str>`: A list of node IDs that are the outputs of the given node
    """
    outgoing = []
    for edge in flow.edges:
        if edge.source == node.id:
            outgoing.append(edge.target)
    return outgoing

def get_inputs(node, flow):
    """Inputs of the given node as list of node IDs (=UAC).

    # Args:
    -`node:StreamlitFlowNode`: The node
    -`flow:StreamlitFlow`: The flow (contains edges)
    # Returns:
    -`list<str>`: A list of node IDs that are the inputs of the given node
    """
    incoming = []
    for edge in flow.edges:
        if edge.target == node.id:
            incoming.append(edge.source)
    return incoming

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

def export_flow(flow):
    """Export the given flow as ReSiE input file.

    # Args
    -`flow:StreamlitFlow`: The flow to export
    # Returns
    -`str`: The content of the input file
    """
    as_dict = base_dict()

    for node in flow.nodes:
        if node.id == "dummy":
            continue

        comp_dict = component_config(node.data["component_type"])
        if node.data["component_type"].lower() == "bus":
            comp_dict["connections"]["input_order"] = get_inputs(node, flow)
            comp_dict["connections"]["output_order"] = get_outputs(node, flow)
            comp_dict["connections"]["energy_flow"] = energy_matrix(
                len(comp_dict["connections"]["input_order"]),
                len(comp_dict["connections"]["output_order"])
            )
        else:
            comp_dict["output_refs"] = get_outputs(node, flow)

        as_dict["components"][node.id] = comp_dict

    return dumps(as_dict, indent=4)
