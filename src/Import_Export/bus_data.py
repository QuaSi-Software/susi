from typing import List, Dict

from streamlit_flow.elements import (
    StreamlitFlowNode,
)


def update_bus_data(node: StreamlitFlowNode, connected_node_id: str, incoming: bool):
    """Add a row or column of 1s to the energy_flow matrix depending on the new edge/node connection"""
    if node.data["component_type"].lower() != "bus":
        return
    bus_data: Dict[str, List] = node.data["bus_data"]
    bus_data["input_order" if incoming else "output_order"].append(connected_node_id)
    # update energy flow and fill with 1s by default
    # inputs are rows, outputs are columns
    energy_flow: List[List[str]] = bus_data["energy_flow"]
    if incoming:
        new_row = [1 for x in bus_data["output_order"]]
        energy_flow.append(new_row)
    else:
        for row in energy_flow:
            row.append(1)
    bus_data["energy_flow"] = energy_flow


def are_permutations(arr1, arr2):
    """Are two arrays permutations of each other e.g. [a,b,c] and [c,b,a]"""
    if len(arr1) is not len(arr2):
        return False

    for x in arr1:
        if x not in arr2:
            return False
    return True


def is_int_matrix_of_size(matrix: List[List[int]], num_rows: int, num_cols: int):
    """Check if a matrix is the right size and every element is an integer"""
    # check matrix has the right number of rows
    if len(matrix) is not num_rows:
        return False
    # check every row has right lenght
    for row in matrix:
        if len(row) is not num_cols:
            return False
        # check all elements are integers
        for element in row:
            if type(element) is not type(1):
                return False

    return True


def check_order_valid(
    node: StreamlitFlowNode,
    imported_bus_data: Dict[str, List],
    warnings: List[str],
    key: str,
):
    """
    Check if input_order or output_order is valid depending on key.
    If it is invalid, show a warning message. Return the assigned order list
    """
    import_order = imported_bus_data[key]
    generated_order = node.data["bus_data"][key]
    if are_permutations(import_order, generated_order):
        node.data["bus_data"][key] = import_order
    else:
        warnings.append("Bus " + node.data["content"] + " has an invalid " + key + ".")
    return node.data["bus_data"][key]


def check_bus_data(
    node: StreamlitFlowNode, imported_bus_data: Dict[str, List], warnings: List[str]
):
    """
    Check that the bus_data that was generated from the connection info
    matches the data that was in the import file to make sure the configuration is valid.
    input and output order must be permutations of the generated version.
    The energy_flow matrix must have the right dimensions
    """
    # check input_order and output_order
    input_order = check_order_valid(node, imported_bus_data, warnings, "input_order")
    output_order = check_order_valid(node, imported_bus_data, warnings, "output_order")
    # check energy_flow is the right size
    imported_energy_flow = imported_bus_data["energy_flow"]
    if is_int_matrix_of_size(imported_energy_flow, len(input_order), len(output_order)):
        node.data["bus_data"]["energy_flow"] = imported_energy_flow
    else:
        warnings.append("Bus " + node.data["content"] + " has invalid energy_matrix")
