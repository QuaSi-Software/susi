import streamlit as st
from datetime import datetime

from Susi_Variables.susi_variable import SusiInput, InputType
from Susi_Variables.susi_variable_list import get_io_settings, get_simulation_parameters


def initialize_susi_variable_session_state():
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
            )
        case InputType.Float:
            value = st.number_input(
                label=input.name,
                help=input.help,
                key=key,
                value=input.get_value(),
                format="%f",
            )
        case InputType.Int:
            value = st.number_input(
                label=input.name,
                help=input.help,
                key=key,
                value=input.get_value(),
                format="%i",
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
            value = st.radio(
                label=input.name,
                index=index,
                help=input.help,
                options=input.options,
                key=key,
                horizontal=True,
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
        case InputType.Dropdown_With_Custom_Option:
            index = input.options.index(input.get_value())
            # if the selected option is the last option in the list, the custom option is selected
            is_custom = index == len(input.options) - 1
            # show dropdown
            with st.container(border=True):
                value = st.radio(
                    label=input.name,
                    index=index,
                    help=input.help,
                    options=input.options,
                    key=key,
                )
                # if it is custom, show the custom text
                if is_custom:
                    custom_input_value = st.text_area(
                        label=input.name + " Custom Input",
                        value=input.get_custom_input_value(),
                        help=input.help,
                        key=key + "_Custom_Input_Field",
                        height=300,
                    )
                    input.set_custom_input_value(custom_input_value)

    input.set_value(value)


def susi_variables_menu():
    with st.expander("Export Settings"):
        c1, c2 = st.columns(2, gap="large")
        with c1:
            st.header("IO Settings")
            input: SusiInput
            for input in get_io_settings():
                display_input(input=input)

        with c2:
            st.header("Simulation Parameters")
            for input in get_simulation_parameters():
                display_input(input=input)


def update_susi_menu():
    st.session_state["menu_update_counter"] += 1
