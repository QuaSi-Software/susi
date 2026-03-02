import streamlit as st
from datetime import datetime

from Susi_Variables.susi_variable import SusiInput, InputType
from Susi_Variables.susi_variable_list import io_settings, simulation_parameters


def initialize_susi_variable_session_state():
    input: SusiInput
    for input in io_settings + simulation_parameters:
        if input.key not in st.session_state:
            st.session_state[input.key] = input.default_value
    if "menu_update_counter" not in st.session_state:
        st.session_state["menu_update_counter"] = 0


def display_input(input: SusiInput):
    key = input.key + "_" + str(st.session_state["menu_update_counter"])
    match (input.input_type):
        case InputType.Date:
            value = st.datetime_input(
                label=input.name,
                value=input.get_value(),
                help=input.help,
                key=key,
                format="DD.MM.YYYY",
            )
        case InputType.Number:
            value = st.number_input(
                label=input.name,
                help=input.help,
                key=key,
                value=input.get_value(),
            )
        case InputType.String:
            value = st.text_input(
                label=input.name,
                value=input.get_value(),
                help=input.help,
                key=key,
            )
        case InputType.Dropdown:
            index = input.options.index(input.get_value())
            value = st.selectbox(
                label=input.name,
                index=index,
                help=input.help,
                options=input.options,
                key=key,
            )
        case InputType.Multiselect:
            value = st.multiselect(
                label=input.name,
                options=input.options,
                default=input.get_value(),
                key=key,
                help=input.help,
            )
        case InputType.Boolean:
            value = st.checkbox(
                label=input.name,
                value=input.get_value(),
                key=key,
                help=input.help,
            )
    input.set_value(value)


def susi_variables_menu():
    with st.expander("Export Settings"):
        c1, c2 = st.columns(2, gap="large")
        with c1:
            st.header("IO Settings")
            input: SusiInput
            for input in io_settings:
                display_input(input=input)

        with c2:
            st.header("Simulation Parameters")
            for input in simulation_parameters:
                display_input(input=input)


def update_susi_menu():
    st.session_state["menu_update_counter"] += 1
