"""
The streamlit implementation of SUSI (Simple UI for Simulation Input).

Run this with
`python -m streamlit run main.py`
after having installed dependencies with
`pip install streamlit streamlit-flow-component`
"""
from random import randint
import streamlit as st
import streamlit_flow
from streamlit_flow import streamlit_flow as streamlit_flow_component
from streamlit_flow.elements import StreamlitFlowNode
from streamlit_flow.state import StreamlitFlowState
from streamlit_flow.layouts import ManualLayout, TreeLayout
from export import export_flow
from components import node_info, categories, Node_Type
import importlib

def check_state():
    """Ensures the current state is attached to the simulation state and creates it if not."""
    if 'current_state' not in st.session_state:
        # for some reason initialising with an empty node list causes the state to not
        # recognize when nodes are added. as a workaround we initialise with a hidden
        # dummy node and ignore it in the output
        st.session_state.current_state = StreamlitFlowState(
            [StreamlitFlowNode(id="dummy", pos=(0,0), data={"content": ""}, hidden=True)],
            []
        )
    if "exported" not in st.session_state:
        st.session_state.exported = ""

def add_node(new_node):
    """Add the given node to the node list.

    # Args:
    -`new_node:StreamlitFlowNode`: The node to add
    """
    check_state()
    st.session_state.current_state.nodes.append(new_node)

def nr_of_nodes(segment, nodes):
    """The number of nodes with the given segment occuring in the UAC.
    
    # Args:
    -`segment:str`: The segment to look for
    -`nodes:List<StreamlitFlowNode>`: The nodes to search through
    # Returns:
    -`int`: The number of nodes with the given segment in their UA
    """
    return len([n for n in nodes if segment in n.id])

def lpad(to_pad, to_len, pad_char="0"):
    """Left-pads the given string.

    Doesn't handle edge cases very well.

    # Args:
    -`to_pad:str`: The string to pad
    -`to_len`: Length to which to pad
    -`pad_char`: The character used for padding
    # Returns:
    -`str`: The padded string
    """
    return (str(pad_char) * int(to_len - len(to_pad))) + to_pad

def create_node(prefix, component_type):
    """Create a node of the given type.

    # Args:
    -`prefix:str`: Prefix for the UAC
    -`component_type:str`: The component type
    # Returns:
    -`StreamlitFlowNode`: The created node
    """
    node : Node_Type = node_info(component_type)
    src_handles, trg_handles, segment = node.nr_inputs, node.nr_outputs, node.segment
    uac = prefix + f"_{segment}_" + lpad(
        str(nr_of_nodes(f"_{segment}_", st.session_state.current_state.nodes) + 1), 2, "0"
    )

    return StreamlitFlowNode(
        id=uac,
        pos=(randint(-20, 20), randint(-20, 20)),
        data={
            'content': uac,
            'component_type': component_type,
        },
        node_type='default',
        source_position='right',
        source_handles=trg_handles, # the definition of input/output is reversed for
        target_position='left',     # Streamlit Flow, as they reference the edges and not
        target_handles=src_handles, # the nodes, so we switch it here
        deletable=True,
        style={'color': 'white', 'backgroundColor': node.node_color, 'border': '1px solid white'}
    )

def main():
    """Entry point to the streamlit process."""
    importlib.reload(streamlit_flow)
    check_state()
    st.set_page_config("SUSI - Simple UI for Simulation Input", layout="wide")

    with st.sidebar:
        st.markdown("## Settings")
        prefix = st.text_input("UAC prefix", "TST")

        st.markdown("## Components")
        cats = categories()
        for cat_name in cats["_order"]:
            st.markdown(f"### {cat_name}")

            for entry in cats[cat_name]:
                if st.button(entry[1], use_container_width=True):
                    add_node(create_node(prefix, entry[0]))

        st.markdown("## Actions")

        if st.button("Export"):
            st.session_state.exported = export_flow(st.session_state.current_state)

    st.session_state.current_state = streamlit_flow_component(
        'energy_system', 
        st.session_state.current_state,
        layout=TreeLayout(direction="right"),
        fit_view=True,
        enable_node_menu=True,
        enable_edge_menu=True,
        enable_pane_menu=True,
        get_edge_on_click=True,
        get_node_on_click=True,
        show_minimap=True,
        hide_watermark=True,
        allow_new_edges=True,
        min_zoom=0.1,
        default_edge_options={"deletable":True}
    )

    st.text("Hey")
    st.text_area("Exported", st.session_state.exported)

main()
