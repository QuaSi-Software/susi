import streamlit as st

from export_settings import io_settings, simulation_parameters, SusiInput, InputType


def set_default_export_settings():
    pass
    for input in io_settings + simulation_parameters:
        if input.key not in st.session_state:
            st.session_state[input.key] = input.default_value


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


def export_settings_dict():
    pass
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
