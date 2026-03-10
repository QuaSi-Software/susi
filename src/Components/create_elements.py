import streamlit as st
from streamlit_flow.elements import (
    StreamlitFlowNode,
    StreamlitFlowEdge,
)
from Components.node_types import NodeType
from Components.node_input import get_node_inputs, NodeInput
from Mediums.mediums import serialize_mediums_list, medium_is_source

from typing import List, Dict


def get_handle_medium_dict(
    node_inputs: List[NodeInput], num_src_handles: int, num_target_handles
):
    medium_variables: List[NodeInput] = [x for x in node_inputs if x.is_medium]
    if len(medium_variables) == 1:
        # all handles are mapped to that variable name
        medium_variable_name = medium_variables[0].resie_name
        src_list = [medium_variable_name] * num_src_handles
        trgt_list = [medium_variable_name] * num_target_handles
    else:
        # each medium defines one handle
        src_list, trgt_list = [], []
        for m in medium_variables:
            medium_variable_name = m.resie_name
            if medium_is_source(medium_variable_name):
                src_list.append(medium_variable_name)
            else:
                trgt_list.append(medium_variable_name)
        trgt_list.sort()
        src_list.sort()
    return {
        "source": src_list,
        "target": trgt_list,
    }


def get_handle_medium(
    input_node: StreamlitFlowNode, sourceOrTarget: str, input_node_handle_index: int
):
    medium_dict: Dict = input_node.data["handle_medium_dict"]
    medium_var_name: str = medium_dict[sourceOrTarget][input_node_handle_index]
    medium_key = next(
        (
            x.value
            for x in input_node.data["resie_data"]
            if x.resie_name == medium_var_name
        ),
        "UNDEFINED",
    )
    mediums = serialize_mediums_list()
    medium = next((x for x in mediums if x["key"] == medium_key), None)
    return medium


def create_new_node(
    name: str,
    position: tuple,
    node_type: NodeType,
):
    resie_data = get_node_inputs(node_type.type_name)
    # generate dictionary that maps handle names to the medium variable that controls it
    handle_medium_dict = get_handle_medium_dict(
        resie_data, node_type.nr_outputs, node_type.nr_inputs
    )

    bus_data = None
    if node_type.type_name.lower() == "bus":
        bus_data = (
            {
                "energy_flow": [],
                "input_order": [],
                "output_order": [],
            },
        )
    return StreamlitFlowNode(
        id=name,
        pos=position,
        data={
            "content": name,
            "component_type": node_type.type_name,
            "resie_data": resie_data,
            "handle_medium_dict": handle_medium_dict,
            "bus_data": bus_data,
        },
        node_type="default",
        source_position="right",
        source_handles=node_type.nr_outputs,  # the definition of input/output is reversed for
        target_position="left",  # Streamlit Flow, as they reference the edges and not
        target_handles=node_type.nr_inputs,  # the nodes, so we switch it here
        deletable=True,
        style={
            "color": "white",
            "backgroundColor": node_type.node_color,
            "border": "1px solid white",
        },
    )


def update_bus_data(node: StreamlitFlowNode, connected_node_id: str, incoming: bool):
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


def create_new_edge(
    input_node: StreamlitFlowNode,
    output_node: StreamlitFlowNode,
    input_node_handle_index: int,
    output_node_handle_index: int,
    warning_messages: List[str],
):
    """
    Source and target are as defined by resie. This function converts them into the right direction for resie to handle
    Arguments
        - **input_node** : the node that acts as an input in the resie configuration
        - **output_node** : the node that acts as an output in the resie configuration
        - **input_node_handle_index** : the index of the handle the edge should attach to on the input node
        - **output_node_handle_index** : the index of the handle the edge should attach to on the output node
    """
    # set the actual index of this edge and the handle names
    input_node_handle_index = min(
        input_node_handle_index,
        input_node.source_handles - 1,
    )
    handle_on_source_node = "source-" + str(input_node_handle_index)
    output_node_handle_index = min(
        output_node_handle_index,
        output_node.target_handles - 1,
    )
    handle_on_target_node = "target-" + str(output_node_handle_index)

    # get medium for this edge
    input_medium = get_handle_medium(input_node, "source", input_node_handle_index)
    output_medium = get_handle_medium(output_node, "target", output_node_handle_index)
    if input_medium["key"] != output_medium["key"]:
        warning_messages.append(
            "The nodes "
            + str(input_node.data["content"])
            + " and "
            + str(output_node.data["content"])
            + " could not be connected, because their mediums don't match."
        )
        return None

    # if one of the nodes is a bus, update the bus data
    update_bus_data(input_node, output_node.id, False)
    update_bus_data(output_node, input_node.id, True)

    # create the actual edge
    return StreamlitFlowEdge(
        id=f"{input_node.id}-{output_node.id}_{input_node_handle_index}",
        source=input_node.id,
        target=output_node.id,
        sourceHandle=handle_on_source_node,
        targetHandle=handle_on_target_node,
        deletable=True,
        style={
            "stroke": input_medium["color"],
        },
        medium_key=input_medium["key"],
    )
