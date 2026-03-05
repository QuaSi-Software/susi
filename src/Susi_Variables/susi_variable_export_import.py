from typing import List, Dict

import streamlit as st
from dateutil import parser
from datetime import datetime

from Susi_Variables.susi_variable_list import get_simulation_parameters, get_io_settings
from Susi_Variables.susi_variable import (
    SusiInput,
    SusiVariableCategory,
    getKey,
    InputType,
)
from Susi_Variables.susi_variable_menu import update_susi_menu


def get_export_date_format():
    """Take the date format in the variable start_end_unit in the simulation parameters and turn it into a datetime format"""
    format = st.session_state[
        getKey(SusiVariableCategory.SimulationParameter) + "/start_end_unit"
    ]
    # Mapping of human-readable parts to strftime codes
    mapping = {
        "dd": "%d",
        "mm": "%m",
        "yyyy": "%Y",
        "yy": "%y",
        "HH": "%H",
        "hh": "%I",
        "MM": "%M",
        "ss": "%S",
        "AM/PM": "%p",
        "am/pm": "%p",
    }

    # Replace all keys in mapping with their strftime codes
    for k, v in mapping.items():
        format = format.replace(k, v)

    return format


def get_export_value(susiInput: SusiInput):
    """Get the value that should actually be written in the export file for a given SusiInput"""
    value = susiInput.get_value()
    # export date string
    if susiInput.input_type == InputType.Date and value is not None:
        value = value.strftime(get_export_date_format())
    # handle case of dropdown with custom option
    if (
        susiInput.input_type == InputType.Dropdown_With_Custom_Option
        and value == susiInput.options[-1]
    ):
        value = susiInput.get_custom_input_value()
    return value


def set_value_from_import(susiInput: SusiInput, value, warnings: List[str]):
    """Get the SusiInput value from an import file"""
    # import date string
    if susiInput.input_type == InputType.Date:
        try:
            value = parser.parse(value, dayfirst=False)
        except (ValueError, OverflowError) as e:
            warnings.append("Imported Date " + value + " could not be parsed")
            value = None
    # handle case of dropdown with custom option
    if (
        susiInput.input_type == InputType.Dropdown_With_Custom_Option
        and value not in susiInput.options
    ):
        susiInput.set_custom_input_value(value)
        value = susiInput.options[-1]
    # set value
    susiInput.set_value(value)


def export_susi_variables():
    input: SusiInput
    io_settings_dict = {}
    for input in get_io_settings():
        value = get_export_value(input)
        if (value is not None and value != "") or not input.optional:
            io_settings_dict[input.name] = value
    simulation_parameters_dict = {}
    for input in get_simulation_parameters():
        value = get_export_value(input)
        if value is not None and value != 0:
            simulation_parameters_dict[input.name] = value
    return {
        getKey(SusiVariableCategory.IOSetting): io_settings_dict,
        getKey(SusiVariableCategory.SimulationParameter): simulation_parameters_dict,
    }


def import_non_component_data(import_dict, warnings):
    """Update the Simulation Parameters and IO Settings in session state using the import data"""
    # IO Settings
    io_settings_dict: Dict = import_dict[getKey(SusiVariableCategory.IOSetting)]
    for input in get_io_settings():
        if input.name in io_settings_dict:
            set_value_from_import(input, io_settings_dict[input.name], warnings)
    # simulation_parameters
    simulation_parameter_dict: Dict = import_dict[
        getKey(SusiVariableCategory.SimulationParameter)
    ]
    for input in get_simulation_parameters():
        if input.name in simulation_parameter_dict:
            set_value_from_import(
                input, simulation_parameter_dict[input.name], warnings
            )
    update_susi_menu()
