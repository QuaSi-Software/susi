import streamlit as st
from streamlit_flow import streamlit_flow as streamlit_flow_component
from streamlit_flow.elements import StreamlitFlowNode, StreamlitFlowEdge
from streamlit_flow.state import StreamlitFlowState
from nodeTypes import get_node_with_name
from createElements import create_new_node, create_new_edge
import json
from typing import Dict, List
from nodeTypes import Node_Type
from nodeInput import NodeInput


def generate_node_import_data(obj:Dict[str, any]):
    type_name = obj["type"]
    if type_name == "GridConnection":
        if obj["is_source"]:
            type_name = "gridinput"
        else:
            type_name = "gridoutput"
    return {
            'node_position' : {
                "x" : -0,
                "y" : -0
            },
            'node_type' : type_name,
        }

def generate_state_from_import(import_data:str):
    warning_messages = []
    try:
        import_dict:dict = json.loads(import_data)
    except ValueError as e:
        warning_messages.append("Input is not a valid JSON.")
        return warning_messages, None

    #First pass: create all the nodes
    node_array = []
    node_array.append(StreamlitFlowNode(id="dummy", pos=(0,0), data={"content": ""}, hidden=True))
    node_dict :Dict[str, StreamlitFlowNode] = {}
    components = import_dict["components"].items()
    for node_id, node_data in components:
        # import data
        node_import_data = node_data.get("import_data", None)
        if node_import_data == None:
            #this file was created before import support was added
            node_import_data = generate_node_import_data(node_data)
            node_data["import_data"] = node_import_data

        node_type : Node_Type = get_node_with_name(node_import_data["node_type"])
        pos=(node_import_data["node_position"]["x"], node_import_data["node_position"]["y"])
        # create a node 
        new_node = create_new_node(name=node_id, position=pos, node_type=node_type)

        #fill in with node info from import
        resie_data = new_node.data["resie_data"]
        node_input : NodeInput
        for node_input in resie_data:
            value = node_data.get(node_input.resie_name, None)
            if value is not None:
                node_input.value = value
            
        node_array.append(new_node)
        node_dict[node_id] = new_node
    
    # Second Pass: create all the edges
    edge_array = []
    num_incoming_edges_per_node:Dict[str, int]= {} # key: node id, value: how many edges it has as input
    for input_node_id, input_node_data in components:
        # get outgoing edges of node
        if input_node_data["import_data"]["node_type"].lower()=="bus":
            output_refs = input_node_data["connections"]["output_order"]
        else:
            output_refs = input_node_data["output_refs"]

        #add StreamlitFlowEdge to every node connection
        if type(output_refs) == type({}):
            output_refs =[value for key, value in output_refs.items()]
        
        for input_node_outgoing_edge_index, output_node_id in enumerate(output_refs):
            if output_node_id not in node_dict:
                warning_messages.append("Node "+output_node_id+" is not defined in components.")
                continue
            # get StreamlitFlowNode references
            input_node = node_dict[input_node_id]
            output_node = node_dict[output_node_id]
            # get number of edges already connected to output node and increment it
            output_node_incoming_edges = num_incoming_edges_per_node.get(output_node_id, 0)
            num_incoming_edges_per_node[output_node_id] = output_node_incoming_edges + 1
            new_edge = create_new_edge(input_node,output_node, input_node_outgoing_edge_index, output_node_incoming_edges, )
            edge_array.append(new_edge)



    new_state:StreamlitFlowState = StreamlitFlowState(
        node_array,
        edge_array
    )
    print(warning_messages)
    return warning_messages, new_state
