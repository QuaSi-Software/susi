import streamlit as st
from streamlit_flow import streamlit_flow as streamlit_flow_component
from streamlit_flow.elements import StreamlitFlowNode
from streamlit_flow.state import StreamlitFlowState
from nodeTypes import get_node_with_name, create_new_node
# from components import node_info, categories, Node_Type
import json

def generate_state_from_import(import_data:str):
    try:
        import_dict:dict = json.loads(import_data)
    except ValueError as e:
        st.text("Input is not a valid JSON")
        return None

    #First pass: create all the nodes
    node_array = []
    node_array.append(StreamlitFlowNode(id="dummy", pos=(0,0), data={"content": ""}, hidden=True))
    for node_id, obj in import_dict["components"].items():
        node_type = get_node_with_name(obj["type"])
        pos=(obj["node_position"]["x"], obj["node_position"]["y"])
        node_array.append(create_new_node(name=node_id, position=pos, node_type=node_type))
    
    # Second Pass: create all the edges
    new_state:StreamlitFlowState = StreamlitFlowState(
        node_array,
        []
    )
    return new_state
