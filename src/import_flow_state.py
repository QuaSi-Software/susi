import streamlit as st
from streamlit_flow import streamlit_flow as streamlit_flow_component
from streamlit_flow.elements import StreamlitFlowNode, StreamlitFlowEdge
from streamlit_flow.state import StreamlitFlowState
from nodeTypes import get_node_with_name, create_new_node
# from components import node_info, categories, Node_Type
import json
from typing import Dict, List
from nodeTypes import Node_Type
from nodeInput import NodeInput

def generate_state_from_import(import_data:str):
    try:
        import_dict:dict = json.loads(import_data)
    except ValueError as e:
        st.text("Input is not a valid JSON")
        return None

    #First pass: create all the nodes
    node_array = []
    node_array.append(StreamlitFlowNode(id="dummy", pos=(0,0), data={"content": ""}, hidden=True))
    for source_node_id, obj in import_dict["components"].items():
        # import data
        node_import_data = obj["import_data"]
        node_type : Node_Type = get_node_with_name(node_import_data["node_type"])
        pos=(node_import_data["node_position"]["x"], node_import_data["node_position"]["y"])
        # create a node 
        new_node = create_new_node(name=source_node_id, position=pos, node_type=node_type)

        #fill in with node info from import
        resie_data = new_node.data["resie_data"]
        node_input : NodeInput
        for node_input in resie_data:
            value = obj.get(node_input.resie_name, None)
            if value is not None:
                node_input.value = value
            
        node_array.append(new_node)
    
    # Second Pass: create all the edges
    edge_array = []
    num_source_edges:Dict[str, int]= {} # key: node id, value: how many edges it has as input
    for source_node_id, obj in import_dict["components"].items():
        # get outgoing edges of node
        if obj["import_data"]["node_type"].lower()=="bus":
            output_refs = obj["connections"]["output_order"]
        else:
            output_refs = obj["output_refs"]

        #add StreamlitFlowEdge to every node connection
        for i, target_node_id in enumerate(output_refs):
            target_num_source_edges = num_source_edges.get(target_node_id, 0)
            sourceHandle = "source-"+str(i)
            targetHandle = "target-"+str(target_num_source_edges)
            num_source_edges[target_node_id] = target_num_source_edges + 1
            new_edge = StreamlitFlowEdge(
                id=f"{source_node_id}-{target_node_id}",
                source=source_node_id, 
                target=target_node_id, 
                sourceHandle=sourceHandle, 
                targetHandle=targetHandle,
                deletable=True,
            )
            edge_array.append(new_edge)



    new_state:StreamlitFlowState = StreamlitFlowState(
        node_array,
        edge_array
    )
    return new_state
