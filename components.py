"""Contains ReSiE-component-specific data and how they relate to components of streamlit flow.
"""

def node_info(component_type):
    """Info required for creating a node of the given component type.

    # Args:
    -`component_type:str`: The component type
    # Returns:
    -`node_type:str`: The node type, determines incoming/outgoing edge connections
    -`segment:str`: The segment for the UAC
    """
    name = component_type.lower()
    if name == "bus":
        return ("default", "BUS")
    elif name == "boundedsupply":
        return ("input", "SRC")
    elif name == "demand":
        return ("output", "DEM")
    else:
        raise NotImplementedError(f"Unknown component type {component_type}")
