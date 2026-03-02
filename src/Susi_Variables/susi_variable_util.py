from typing import List

import streamlit as st
from Susi_Variables.susi_variable_list import simulation_parameters, io_settings
from Susi_Variables.susi_variable import SusiInput


# ---------------- Functions ------------------------
def set_default_susi_variables():
    input: SusiInput
    for input in io_settings + simulation_parameters:
        if input.key not in st.session_state:
            st.session_state[input.key] = input.default_value


def export_susi_variables():
    input: SusiInput
    io_settings_dict = {}
    for input in io_settings:
        io_settings_dict[input.name] = input.getValue()
    simulation_parameters_dict = {}
    for input in simulation_parameters:
        simulation_parameters_dict[input.name] = input.getValue()
    return {
        "io_settings": io_settings_dict,
        "simulation_parameters": simulation_parameters_dict,
    }
