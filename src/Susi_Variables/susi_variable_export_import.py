from typing import List, Dict

import streamlit as st
from Susi_Variables.susi_variable_list import simulation_parameters, io_settings
from Susi_Variables.susi_variable import SusiInput, SusiVariableCategory, getKey
from Susi_Variables.susi_variable_menu import update_susi_menu


def export_susi_variables():
    input: SusiInput
    io_settings_dict = {}
    for input in io_settings:
        io_settings_dict[input.name] = input.get_export_value()
    simulation_parameters_dict = {}
    for input in simulation_parameters:
        simulation_parameters_dict[input.name] = input.get_export_value()
    return {
        getKey(SusiVariableCategory.IOSetting): io_settings_dict,
        getKey(SusiVariableCategory.SimulationParameter): simulation_parameters_dict,
    }


def import_non_component_data(import_dict):
    """Update the Simulation Parameters and IO Settings in session state using the import data"""
    # IO Settings
    io_settings_dict: Dict = import_dict[getKey(SusiVariableCategory.IOSetting)]
    for input in io_settings:
        if input.name in io_settings_dict:
            input.set_value_from_import(io_settings_dict[input.name])
    # simulation_parameters
    simulation_parameter_dict: Dict = import_dict[
        getKey(SusiVariableCategory.SimulationParameter)
    ]
    for input in simulation_parameters:
        if input.name in simulation_parameter_dict:
            input.set_value_from_import(simulation_parameter_dict[input.name])
    update_susi_menu()
