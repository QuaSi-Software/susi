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

def categories():
    """Categories of component types for navigation/display purposes.

    # Returns:
    -`dict<list>`: A dict of categories, with each entry of a category corresponding to a
        component type and each tuple of a type containing the component_type and display
        name for that type.
    """
    return {
        "_order": ["Special", "General"],
        "Special": [
            ("Bus", "Bus"),
        ],
        "General": [
            ("BoundedSupply", "Flexible Supply"),
            ("Demand", "Fixed Demand"),
        ],
    }

def component_config(component_type):
    """Parameters and settings for the given component type.

    # Args:
    -`component_type:str`: The component type
    # Returns:
    -`dict`: The parameters/settings for the given type
    """
    base = {
        "type": component_type,
        "output_refs": [],
    }
    name = component_type.lower()

    if name == "bus":
        return {
            "type": "Bus",
            "medium": "FILL_IN",
            "connections": {
                "input_order": [],
                "output_order": [],
                "energy_flow": [],
            },
        }
    elif name == "boundedsupply":
        return base | {
            "medium": "FILL_IN",
            "_OPTION_1": "",
            "constant_power": -9999,
            "constant_temperature": -9999,
            "_OPTION_2": "",
            "max_power_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    elif name == "demand":
        return base | {
            "medium": "FILL_IN",
            "_OPTION_1": "",
            "constant_demand": -9999,
            "constant_temperature": -9999,
            "_OPTION_2": "",
            "energy_profile_file_path": "FILL_IN",
            "temperature_profile_file_path": "FILL_IN",
            "scale": -9999
        }
    else:
        raise NotImplementedError(f"Unknown component type {component_type}")
