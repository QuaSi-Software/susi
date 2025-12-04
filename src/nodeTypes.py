"""Contains ReSiE-component-specific data and how they relate to components of streamlit flow.
"""
import streamlit as st
from streamlit_flow.elements import StreamlitFlowNode
from streamlit_flow.state import StreamlitFlowState

from dataclasses import dataclass
from enum import Enum
from typing import Dict
from components import component_config

class Node_Category(Enum):
    Special = 0
    General = 1
    Heat = 2
    Electricity = 3
    Other = 4

@dataclass
class Node_Type:
    type_name : str
    button_name : str
    nr_inputs : int
    nr_outputs : int
    segment : str
    category : Node_Category

    node_color : str = "#000000"

    def __post_init__(self):
        self.node_color = get_node_color(self)

    
def get_node_color(node:Node_Type):
    match node.category:
        case Node_Category.Electricity:
            return "#eeb014"
        case Node_Category.Heat:
            return "#bc1b1b"
        case Node_Category.Special:
            return "#1D1446"
    return "#000000"


all_node_types = [
    Node_Type(
        type_name="Bus",
        button_name="Bus",
        nr_inputs=1,
        nr_outputs=1,
        segment="BUS",
        category=Node_Category.Special),
    Node_Type(
        type_name="GridInput",
        button_name="Grid Input",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="GRI",
        category=Node_Category.Special),
    Node_Type(
        type_name="GridOutput",
        button_name="Grid Output",
        nr_inputs=1, 
        nr_outputs=0, 
        segment="GRO",
        category=Node_Category.Special),
    Node_Type(
        type_name="FixedSupply",
        button_name="Fixed Supply",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="SRC",
        category=Node_Category.General),
    Node_Type(
        type_name="BoundedSupply",
        button_name="Bounded Supply",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="SRC",
        category=Node_Category.General),
    Node_Type(
        type_name="Demand",
        button_name="Fixed Demand",
        nr_inputs=1, 
        nr_outputs=0, 
        segment="DEM",
        category=Node_Category.General),
    Node_Type(
        type_name="BoundedSink",
        button_name="Bounded Sink",
        nr_inputs=1, 
        nr_outputs=0, 
        segment="DEM",
        category=Node_Category.General),
    Node_Type(
        type_name="Storage",
        button_name="Storage",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="STO",
        category=Node_Category.General),
    Node_Type(
        type_name="GenericHeatSource",
        button_name="Generic Heat Source",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="GHS",
        category=Node_Category.Heat),
    Node_Type(
        type_name="FuelBoiler",
        button_name="Fuel Boiler",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="FBO",
        category=Node_Category.Heat),
    Node_Type(
        type_name="HeatPump",
        button_name="Heat Pump",
        nr_inputs=2, 
        nr_outputs=1, 
        segment="HP",
        category=Node_Category.Heat),
    Node_Type(
        type_name="GeothermalProbes",
        button_name="Geothermal Probes",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="GTP",
        category=Node_Category.Heat),
    Node_Type(
        type_name="GeothermalHeatCollector",
        button_name="Geothermal Heat Collector",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="GHC",
        category=Node_Category.Heat),
    Node_Type(
        type_name="Buffertank",
        button_name="Buffertank",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="BFT",
        category=Node_Category.Heat),
    Node_Type(
        type_name="SeasonalThermalStorage",
        button_name="Seasonal Thermal Storage",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="STS",
        category=Node_Category.Heat),
    Node_Type(
        type_name="SolarthermalCollector",
        button_name="Solarthermal Collector",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="STC",
        category=Node_Category.Heat),
    Node_Type(
        type_name="Chpp",
        button_name="Combined-Heat-Power Plant",
        nr_inputs=1, 
        nr_outputs=2, 
        segment="CHPP",
        category=Node_Category.Electricity),
    Node_Type(
        type_name="Pvplant",
        button_name="Photovoltaic Plant",
        nr_inputs=0, 
        nr_outputs=1, 
        segment="PV",
        category=Node_Category.Electricity),
    Node_Type(
        type_name="Battery",
        button_name="Battery",
        nr_inputs=1, 
        nr_outputs=1, 
        segment="BAT",
        category=Node_Category.Electricity),
    Node_Type(
        type_name="Electrolyser",
        button_name="Electrolyser",
        nr_inputs=1, 
        nr_outputs=4, 
        segment="ELY",
        category=Node_Category.Other),
]


def get_node_types_in_category(category_name):
    arr = []
    for node in all_node_types:
        if node.category == category_name:
            arr.append(node)
    return arr

def get_node_with_name(type_name):
    for node in all_node_types:
        if node.type_name.lower() == type_name.lower():
            return node
    return None

def create_new_node(name : str, position : tuple, node_type : Node_Type, resie_data:Dict[str, any]=None):
    if resie_data is None:
        resie_data = component_config(node_type.type_name)

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
        source_handles=node_type.nr_inputs, # the definition of input/output is reversed for
        target_position='left',     # Streamlit Flow, as they reference the edges and not
        target_handles=node_type.nr_outputs, # the nodes, so we switch it here
        deletable=True,
        style={'color': 'white', 'backgroundColor': node_type.node_color, 'border': '1px solid white'}
    )