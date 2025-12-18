"""Contains ReSiE-component-specific data and how they relate to components of streamlit flow.
"""
from dataclasses import dataclass
from enum import Enum

class NodeCategory(Enum):
    Special = 0
    General = 1
    Heat = 2
    Electricity = 3
    Other = 4

@dataclass
class NodeType:
    type_name : str
    button_name : str
    # inputs and outputs are the RESIE input and outputs, not how it should be displayed in the graph
    nr_inputs : int
    nr_outputs : int
    segment : str
    category : NodeCategory

    node_color : str = "#000000"

    def __post_init__(self):
        self.node_color = get_node_color(self)

    
def get_node_color(node:NodeType):
    match node.category:
        case NodeCategory.Electricity:
            return "#eeb014"
        case NodeCategory.Heat:
            return "#bc1b1b"
        case NodeCategory.Special:
            return "#1D1446"
    return "#000000"


all_node_types = [
    NodeType(
        type_name="Bus",
        button_name="Bus",
        nr_inputs=1,
        nr_outputs=1,
        segment="BUS",
        category=NodeCategory.Special),
    NodeType(
        type_name="GridInput",
        button_name="Grid Input",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="GRI",
        category=NodeCategory.Special),
    NodeType(
        type_name="GridOutput",
        button_name="Grid Output",
        nr_inputs=1, 
        nr_outputs=0, 
        segment="GRO",
        category=NodeCategory.Special),
    NodeType(
        type_name="FixedSupply",
        button_name="Fixed Supply",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="SRC",
        category=NodeCategory.General),
    NodeType(
        type_name="BoundedSupply",
        button_name="Bounded Supply",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="SRC",
        category=NodeCategory.General),
    NodeType(
        type_name="Demand",
        button_name="Fixed Demand",
        nr_inputs=1, 
        nr_outputs=0, 
        segment="DEM",
        category=NodeCategory.General),
    NodeType(
        type_name="BoundedSink",
        button_name="Bounded Sink",
        nr_inputs=1, 
        nr_outputs=0, 
        segment="DEM",
        category=NodeCategory.General),
    NodeType(
        type_name="Storage",
        button_name="Storage",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="STO",
        category=NodeCategory.General),
    NodeType(
        type_name="GenericHeatSource",
        button_name="Generic Heat Source",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="GHS",
        category=NodeCategory.Heat),
    NodeType(
        type_name="FuelBoiler",
        button_name="Fuel Boiler",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="FBO",
        category=NodeCategory.Heat),
    NodeType(
        type_name="HeatPump",
        button_name="Heat Pump",
        nr_inputs=2, 
        nr_outputs=1, 
        segment="HP",
        category=NodeCategory.Heat),
    NodeType(
        type_name="GeothermalProbes",
        button_name="Geothermal Probes",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="GTP",
        category=NodeCategory.Heat),
    NodeType(
        type_name="GeothermalHeatCollector",
        button_name="Geothermal Heat Collector",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="GHC",
        category=NodeCategory.Heat),
    NodeType(
        type_name="Buffertank",
        button_name="Buffertank",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="BFT",
        category=NodeCategory.Heat),
    NodeType(
        type_name="SeasonalThermalStorage",
        button_name="Seasonal Thermal Storage",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="STS",
        category=NodeCategory.Heat),
    NodeType(
        type_name="SolarthermalCollector",
        button_name="Solarthermal Collector",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="STC",
        category=NodeCategory.Heat),
    NodeType(
        type_name="Chpp",
        button_name="Combined-Heat-Power Plant",
        nr_inputs=1, 
        nr_outputs=2, 
        segment="CHPP",
        category=NodeCategory.Electricity),
    NodeType(
        type_name="Pvplant",
        button_name="Photovoltaic Plant",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="PV",
        category=NodeCategory.Electricity),
    NodeType(
        type_name="Battery",
        button_name="Battery",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="BAT",
        category=NodeCategory.Electricity),
    NodeType(
        type_name="Electrolyser",
        button_name="Electrolyser",
        nr_inputs=1, 
        nr_outputs=4, 
        segment="ELY",
        category=NodeCategory.Other),
]

def get_node_types_in_category(category_name):
    arr = []
    for node in all_node_types:
        if node.category == category_name:
            arr.append(node)
    return arr

def get_node_type_with_name(type_name):
    for node in all_node_types:
        if node.type_name.lower() == type_name.lower():
            return node
    return None
