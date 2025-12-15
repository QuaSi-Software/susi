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
import math


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
    try:
        import_dict:dict = json.loads(import_data)
    except ValueError as e:
        st.text("Input is not a valid JSON")
        return None

    #First pass: create all the nodes
    node_array = []
    node_array.append(StreamlitFlowNode(id="dummy", pos=(0,0), data={"content": ""}, hidden=True))
    node_dict :Dict[str, StreamlitFlowNode] = {}
    components = import_dict["components"].items()
    for source_node_id, obj in components:
        # import data
        node_import_data = obj.get("import_data", None)
        if node_import_data == None:
            #this file was created before import support was added
            node_import_data = generate_node_import_data(obj)
            obj["import_data"] = node_import_data

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
        node_dict[source_node_id] = new_node
    
    # Second Pass: create all the edges
    edge_array = []
    num_source_edges:Dict[str, int]= {} # key: node id, value: how many edges it has as input
    for source_node_id, obj in components:
        # get outgoing edges of node
        if obj["import_data"]["node_type"].lower()=="bus":
            output_refs = obj["connections"]["output_order"]
        else:
            output_refs = obj["output_refs"]

        #add StreamlitFlowEdge to every node connection
        if type(output_refs) == type({}):
            output_refs =[value for key, value in output_refs.items()]

        for i, target_node_id in enumerate(output_refs):
            if target_node_id not in node_dict:
                print("Node "+target_node_id+" is not defined in components.")
                continue
            source_num_source_edges = num_source_edges.get(source_node_id, 0)
            # source and target are swapped in resie vs. streamlit
            sourceHandle = "target-"+str(min(i, node_dict[target_node_id].source_handles)) 
            targetHandle = "source-"+str(min(source_num_source_edges, node_dict[source_node_id].target_handles)) 
            num_source_edges[source_node_id] = source_num_source_edges + 1
            new_edge = StreamlitFlowEdge(
                id=f"{source_node_id}-{target_node_id}",
                source=source_node_id, 
                target=target_node_id, 
                sourceHandle=targetHandle, 
                targetHandle=sourceHandle,
                deletable=True,
            )
            edge_array.append(new_edge)



    new_state:StreamlitFlowState = StreamlitFlowState(
        node_array,
        edge_array
    )
    return new_state
