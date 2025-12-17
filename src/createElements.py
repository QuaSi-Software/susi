from streamlit_flow.elements import StreamlitFlowNode, StreamlitFlowEdge
from nodeTypes import Node_Type
from nodeInput import get_node_inputs

def create_new_node(name : str, position : tuple, node_type : Node_Type):
    resie_data = get_node_inputs(node_type.type_name)
    return StreamlitFlowNode(
        id=name,
        pos=position,
        data={
            'content': name,
            'component_type': node_type.type_name,
            'resie_data' : resie_data,
        },
        node_type='default',
        source_position='right',
        source_handles=node_type.nr_outputs, # the definition of input/output is reversed for
        target_position='left',     # Streamlit Flow, as they reference the edges and not
        target_handles=node_type.nr_inputs, # the nodes, so we switch it here
        deletable=True,
        style={'color': 'white', 'backgroundColor': node_type.node_color, 'border': '1px solid white'}
    )

"""
 Source and target are as defined by resie. This function converts them into the right direction for resie to handle
 Arguments
    - **input_node** : the node that acts as an input in the resie configuration
    - **output_node** : the node that acts as an output in the resie configuration
    - **input_node_handle_index** : the index of the handle the edge should attach to on the input node
    - **output_node_handle_index** : the index of the handle the edge should attach to on the output node
    """
def create_new_edge(input_node : StreamlitFlowNode, output_node : StreamlitFlowNode, 
                    input_node_handle_index : int, output_node_handle_index : int):
    handle_on_source_node = "source-"+str(min(input_node_handle_index, input_node.source_handles))
    handle_on_target_node = "target-"+str(min(output_node_handle_index, output_node.target_handles)) 
    return StreamlitFlowEdge(
        id=f"{input_node.id}-{output_node.id}",
        source=input_node.id,
        target=output_node.id, 
        sourceHandle=handle_on_source_node, 
        targetHandle=handle_on_target_node,
        deletable=True,
    )

