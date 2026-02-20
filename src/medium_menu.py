import streamlit as st
import copy
from mediums import medium_input, set_default_mediums, update_edges_on_medium_change
from typing import List


def initialize_medium_list():
    # the list of mediums sent to streamlit-flow that the nodes' medium variables can take
    if "mediums" not in st.session_state:
        set_default_mediums()
    # The list of mediums in the menu, which may not yet be applied to the actual mediums sent to streamlit-flow
    if "medium_list_input" not in st.session_state:
        st.session_state.medium_list_input = copy.deepcopy(st.session_state.mediums)
    # reset_counter is incremented to give color picker and text input, so the state
    # of the menu can be reset from code. Otherwise, the widget state persists even
    # when the medium list has been changed
    if "reset_counter" not in st.session_state:
        st.session_state.reset_counter = 0


def check_duplicate_names():
    """
    Go through the list of mediums in the menu and check if any have the same
    names. If so, mark them as inputted_name_valid = false.
    """
    name_dict = {}
    medium: medium_input
    for _, medium in enumerate(st.session_state.medium_list_input):
        count = name_dict.get(medium.name, 0) + 1
        name_dict[medium.name] = count
    for _, medium in enumerate(st.session_state.medium_list_input):
        count = name_dict.get(medium.name)
        medium.inputted_name_valid = count == 1


def input_has_changes():
    """
    Iterate through the mediums and the mediums in the menu and check if these lists are the same by value.
    """
    mediums: List[medium_input] = st.session_state.mediums
    mediums_in_menu: List[medium_input] = st.session_state.medium_list_input
    if len(mediums) is not len(mediums_in_menu):
        return True
    for i in range(len(mediums)):
        m1: medium_input = mediums[i]
        m2: medium_input = mediums_in_menu[i]
        are_equal: bool = (
            m1.key is m2.key and m1.name == m2.name and m1.color == m2.color
        )
        if not are_equal:
            return True
    return False


def undo_menu_changes():
    """Reset the medium menu, reset the widget states and rerun the page to refresh the visuals"""
    st.session_state.medium_list_input = copy.deepcopy(st.session_state.mediums)
    st.session_state.reset_counter += 1
    st.rerun()


def single_medium_input_field(medium: medium_input, medium_index: int):
    """
    For one medium, display the color widget, text input widget and a button to delete itself in one row.
    If this medium has the same name as another medium in the list, mark it with an error
    """
    c1, c2, c3 = st.columns([40, 200, 50], vertical_alignment="bottom")
    with c1:
        color = st.color_picker(
            label="Medium Color",
            value=medium.color,
            key=medium.key + "_color" + str(st.session_state.reset_counter),
        )
        medium.color = color
    with c2:
        icon_name = "check_circle" if medium.inputted_name_valid else "warning"
        new_name = st.text_input(
            label="Medium Name",
            value=medium.name,
            key=medium.key + "_name" + str(st.session_state.reset_counter),
            icon=":material/" + icon_name + ":",
        )
        if medium.name != new_name:
            medium.name = new_name
            check_duplicate_names()
            st.rerun()
    with c3:
        if st.button(
            label="", key=medium.key + "_delete_button", icon=":material/close:"
        ):
            st.session_state.medium_list_input.pop(medium_index)
            check_duplicate_names()
            st.rerun()
    if not medium.inputted_name_valid:
        st.markdown(body=":red[Please input a unique name for your medium]")
    else:
        st.space("small")


def medium_menu():
    """
    Iterate through the mediums in the menu and display them.
    Display buttons for Applying changes, Undoing changes, and reset the mediums to the default values.
    """
    with st.expander("List of Mediums"):
        # for every medium in the list, display the name and color
        medium: medium_input
        index: int
        for index, medium in enumerate(st.session_state.medium_list_input):
            if medium.key == "UNDEFINED":
                continue
            single_medium_input_field(medium=medium, medium_index=index)
        # Button: when clicked, add another medium to the list
        if st.button(label="Add New Medium", icon=":material/add_circle:"):
            st.session_state.medium_list_input.append(medium_input())
            check_duplicate_names()
            st.rerun()
        st.space("small")

        # show submit button only if all changes are valid
        has_changes: bool = input_has_changes()
        c1, c2, c3 = st.columns(3, width=600)
        with c1:
            all_inputs_valid: bool = all(
                medium.inputted_name_valid
                for medium in st.session_state.medium_list_input
            )
            can_submit: bool = has_changes and all_inputs_valid
            if st.button(
                "Submit Changes", disabled=not can_submit, icon=":material/check:"
            ):
                update_edges_on_medium_change(
                    old_medium_list=st.session_state.mediums,
                    new_medium_list=st.session_state.medium_list_input,
                )
                st.session_state.mediums = copy.deepcopy(
                    st.session_state.medium_list_input
                )
        with c2:
            if st.button(
                "Undo Changes", icon=":material/replay:", disabled=not has_changes
            ):
                undo_menu_changes()
        with c3:
            if st.button("Reset Mediums", icon=":material/reset_settings:"):
                set_default_mediums()
                update_edges_on_medium_change(
                    old_medium_list=st.session_state.medium_list_input,
                    new_medium_list=st.session_state.mediums,
                )
                undo_menu_changes()
