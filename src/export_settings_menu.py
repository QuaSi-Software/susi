import streamlit as st

from export_settings import io_settings, simulation_parameters, SusiInput, InputType


def set_default_export_settings():
    if "force_profiles_to_repeat" not in st.session_state:
        st.session_state["simulation_parameters"]["force_profiles_to_repeat"] = True
    pass


def display_input(key: str, input: SusiInput):
    match (input.input_type):
        case InputType.Date:
            st.date_input(
                label=input.name,
                value=input.default_value,
                help=input.help,
                key=key,
            )
        case InputType.Number:
            st.number_input(
                label=input.name,
                help=input.help,
                key=key,
                value=input.default_value,
            )
        case InputType.String:
            st.text_input(
                label=input.name,
                value=input.default_value,
                help=input.help,
            )
        case InputType.Dropdown:
            index = input.options.index(input.default_value)
            st.selectbox(
                label=input.name,
                index=index,
                help=input.help,
                options=input.options,
            )
        case InputType.Multiselect:
            st.multiselect(
                label=input.name,
                options=input.options,
                default=input.default_value,
                key=key,
                help=input.help,
            )
        case InputType.Boolean:
            st.checkbox(
                label=input.name,
                value=input.default_value,
                key=key,
                help=input.help,
            )


def export_settings_menu():
    with st.expander("Export Settings"):
        c1, c2 = st.columns(2, gap="large")
        with c1:
            st.header("IO Settings")
            input: SusiInput
            for input in io_settings:
                key = "io_settings/" + input.name
                display_input(key=key, input=input)

        with c2:
            st.header("Simulation Parameters")
            for input in simulation_parameters:
                key = "simulation_parameters/" + input.name
                display_input(key=key, input=input)


def export_settings_dict():
    print(st.session_state["simulation_parameters/force_profiles_to_repeat"])
