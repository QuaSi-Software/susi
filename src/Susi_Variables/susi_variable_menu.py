import streamlit as st

from Susi_Variables.susi_variable import SusiInput, InputType
from Susi_Variables.susi_variable_list import io_settings, simulation_parameters


def display_input(input: SusiInput):
    match (input.input_type):
        case InputType.Date:
            st.date_input(
                label=input.name,
                value=input.default_value,
                help=input.help,
                key=input.key,
                format="DD.MM.YYYY",
            )
        case InputType.Number:
            st.number_input(
                label=input.name,
                help=input.help,
                key=input.key,
                value=input.default_value,
            )
        case InputType.String:
            st.text_input(
                label=input.name,
                value=input.default_value,
                help=input.help,
                key=input.key,
            )
        case InputType.Dropdown:
            index = input.options.index(input.default_value)
            st.selectbox(
                label=input.name,
                index=index,
                help=input.help,
                options=input.options,
                key=input.key,
            )
        case InputType.Multiselect:
            st.multiselect(
                label=input.name,
                options=input.options,
                default=input.default_value,
                key=input.key,
                help=input.help,
            )
        case InputType.Boolean:
            st.checkbox(
                label=input.name,
                value=input.default_value,
                key=input.key,
                help=input.help,
            )


def export_settings_menu():
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
